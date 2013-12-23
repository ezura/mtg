var peer = new Peer({
  key: '6165842a-5c0d-11e3-b514-75d3313b9d05',  // ローカル
  //key: '4304447a-5d8a-11e3-aced-fba866690e9f', // 本番用
});

var connectedPeers = {};
var member_list = {};

var name;

/**
 * peer イベント
 */
peer.on('open', function(id){
  $('#pid').text(id);
});
peer.on('connection', connect);

function connect(c) {
  if (c.label === 'chat') {
    var member_box = $('#member');
    var messages = $('#messages');
    //c.metadata['user_name'].push(name);
    //member_list[c.peer] = c.metadata['user_name'][0];
    messages.append('<div><span class="peer">' + c.peer + '</span>: connect</div>');

    c.on('data', function(data) {
      messages.append('<div><span class="peer">' + c.peer + '</span>: ' + data + '</div>');
    });
    c.on('close', function() {
      alert(member_list[c.peer] + ' has left the chat.');
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

  // Connect to a peer
  $('#connect').click(function() {
    requestedPeer = $('#rid').val();
    if (!connectedPeers[requestedPeer]) {
      // chat 用
      var chat = peer.connect(requestedPeer, {
        label: 'chat',
        serialization: 'json',
        //metadata: {user_name: [name]}
      });
      chat.on('open', function() {
        connect(chat);
      });
      chat.on('error', function(err) { alert(err); });
      
      // file 用
      var file = peer.connect(requestedPeer, {
        label: 'file',
        //metadata: {user_name: [name]},
        reliable: true });
      file.on('open', function() {
        connect(file);
      });
      file.on('error', function(err) { alert(err); });
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