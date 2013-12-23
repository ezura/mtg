var peer = new Peer({
  key: key_,
});

var connected_peers = {};
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
navigator.getUserMedia({audio: true, video: false},
        function(stream){
          console.log("navigator");
          window.localStream = stream;
        },
        function(){console.log("navigator error");});

/**
 * peer イベント
 */
peer.on('open', function(id){
  $('#pid').text(id);
});

peer.on('connection', connect);

peer.on('call', audioCall);

peer.on('error', function(err){
  alert(err.message);
});

/**
 * チャットとファイル通信
 */
function connect(c) {
  if (c.label === 'chat') {
    var member_box = $('#member');
    var messages = $('#messages');
    messages.append('<div><span class="peer">' + c.peer + '</span>: connect</div>');
    connected_peers[c.peer] = 1;

    c.on('data', function(data) {
      messages.append('<div><span class="peer">' + c.peer + '</span>: ' + data + '</div>');
    });
    c.on('close', function() {
      delete connected_peers[c.peer];
    });
  } else if (c.label === 'file') {
    c.on('data', function(data) {
      if (data.constructor === ArrayBuffer) {
        var dataView = new Uint8Array(data); 
        var dataBlob = new Blob([dataView]);
        var url = window.URL.createObjectURL(dataBlob);
        $('#messages').append('<div><span class="file">' +
            c.peer + 'が<a target="_blank" href="' + url + '">file</a>を送信しました</span></div>');
      }
    });
  }
}

/**
 * 音声データ通信接続時（されたとき）
 */
function audioCall(call) {
  call.answer(window.localStream);
  setOnCall(call);
}

/**
 * call のイベント発生時の動作を設定
 */
function setOnCall(call) {
  call.on('stream', function(stream){
    console.log("call.on('stream', function(stream)");
    $('#audio_sec').append('<audio class="' + call.id + '" src="' + URL.createObjectURL(stream) + '" autoplay></audio>');
  });
}

$(document).ready(function() {
  name = $('#user_name').text();
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

  // 他の人との peer 接続開始
  $('#connect').click(function() {
    requestedPeer = $('#rid').val();
    if (!connected_peers[requestedPeer]) {
      // chat 用
      var chat = peer.connect(requestedPeer, {
        label: 'chat',
        serialization: 'none',
      });
      chat.on('open', function() {
        connect(chat);
      });
      chat.on('error', function(err) { alert(err); });
      
      // file 用
      var file = peer.connect(requestedPeer, {
        label: 'file',
        reliable: true });
      file.on('open', function() {
        connect(file);
      });
      file.on('error', function(err) { alert(err); });
      
      // 通話用
      var call = peer.call(requestedPeer, window.localStream);
      setOnCall(call);
    }
    connected_peers[requestedPeer] = 1;
  });

  // Close a connection.
  $('#close').click(function() {
    eachActiveConnection(function(c) {
      c.close();
    });
  });

  $('#chat_form').submit(function(e) {
    e.preventDefault();
    var msg = $('#text').val();
    $('#messages').append('<div><span class="you">You: </span>' + msg + '</div>');
    eachActiveConnection(function(c, $c) {
      if (c.label === 'chat') {
        c.send(msg);
      }
    });
    $('#text').val('');
    $('#text').focus();
  });

  function eachActiveConnection(fn) {
    var checkedIds = {};
    for(key in connected_peers) {
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