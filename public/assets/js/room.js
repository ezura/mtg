var peer = new Peer({
  key: '6165842a-5c0d-11e3-b514-75d3313b9d05',
  //key: '4304447a-5d8a-11e3-aced-fba866690e9f',
});

// TODO: 統合
var connectedPeers = {};
var member_list = {};

peer.on('open', function(id){
  $('#pid').text(id);
});

// Await connections from others
peer.on('connection', connect);

function connect(c) {
  if (c.label === 'chat') {
    var member_box = $('#member');
    var messages = $('#messages');
    member_list[c.peer] = c.metadata['message'];
    messages.append('<div><span class="peer">' + c.peer + '</span>: connect</div>');

    c.on('data', function(data) {
      messages.append('<div><span class="peer">' + c.peer + '</span>: ' + data + '</div>');
    });
    c.on('close', function() {
      alert(c.peer + ' has left the chat.');
      delete connectedPeers[c.peer];
      delete member_list[c.peer];
    });
  } else if (c.label === 'file') {
    c.on('data', function(data) {
      if (data.constructor === ArrayBuffer) {
        var dataView = new Uint8Array(data);
        var dataBlob = new Blob([dataView]);
        var url = window.URL.createObjectURL(dataBlob);
        $('#messages').append('<div><span class="file">' +
            member_list[c.peer] + 'が<a target="_blank" href="' + url + '">file</a>を送信しました</span></div>');
      }
    });
  }
}

$(document).ready(function() {
  var box = $('#file_box');
  box.on('dragenter', doNothing);
  box.on('dragover', doNothing);
  box.on('drop', function(e){
    e.originalEvent.preventDefault();
    var file = e.originalEvent.dataTransfer.files[0];
    eachActiveConnection(function(c, $c) {
      if (c.label === 'file') {
        c.send(file);
        $('#messages').append('<div><span class="file">You sent a file.</span></div>');
      }
    });
  });
  function doNothing(e){
    e.preventDefault();
    e.stopPropagation();
  }

  // Connect to a peer
  $('#connect').click(function() {
    requestedPeer = $('#rid').val();
    if (!connectedPeers[requestedPeer]) {
      // Create 2 connections, one labelled chat and another labelled file.
      var c = peer.connect(requestedPeer, {
        label: 'chat',
        serialization: 'none',
        metadata: {message: $('#user_name').text()}
      });
      c.on('open', function() {
        connect(c);
      });
      c.on('error', function(err) { alert(err); });
      var f = peer.connect(requestedPeer, { label: 'file', reliable: true });
      f.on('open', function() {
        connect(f);
      });
      f.on('error', function(err) { alert(err); });
    }
    connectedPeers[requestedPeer] = 1;
  });

  // Close a connection.
  $('#close').click(function() {
    eachActiveConnection(function(c) {
      c.close();
    });
  });

  $('#chat_form').submit(function(e) {
    e.preventDefault();
    // For each active connection, send the message.
    var msg = $('#text').val();
    eachActiveConnection(function(c, $c) {
      if (c.label === 'chat') {
        c.send(msg);
        $('#messages').append('<div><span class="you">You: </span>' + msg + '</div>');
      }
    });
    $('#text').val('');
    $('#text').focus();
  });

  function eachActiveConnection(fn) {
    var checkedIds = {};
    for(key in member_list) {
      console.log(key);
      if (!checkedIds[key]) {
        var conns = peer.connections[key];
        for (var i = 0, ii = conns.length; i < ii; i += 1) {
          var conn = conns[i];
          fn(conn, $(this));
        }
      }
      checkedIds[key] = 1;
    }
  }
});

window.onunload = window.onbeforeunload = function(e) {
  if (!!peer && !peer.destroyed) {
    peer.destroy();
  }
};

/**
 * 音声
 */
/* ドキュメントには var recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
 * って書いてあるけど、これだと SpeechRecognition オブジェクトが生成されない
 */
var recognition = window.SpeechRecognition || new webkitSpeechRecognition();
recognition.continuous = false;   // 使い勝手に応じて変更
recognition.lang = "ja-JP";
recognition.onresult = function(event) {
  var length = event.results.length;
  var word = event.results[length-1][0].transcript;
  $("#text").val(word);;
}

function startSpeech() {
  recognition.start();
}
function stopSpeech() {
  recognition.stop();
}