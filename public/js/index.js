var socket = io();
socket.on('connect', function () {
  console.log('Connected to server');
});
socket.on('disconnect', function () {
  console.log('disconnected from server');
});


socket.on('newMessage', function (msg){
  var li = $('<li></li>');
  li.text(msg.from + ': ' + msg.text);
  $('#messages').append(li);
});

$('#message-form').on('submit', function (e) {
  // prevent default behavior of submit event (refresh)
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'user',
    text: $('[name=message]').val(),
    createdAt: new Date().getTime()
  }, function (s) {
    console.log(s);
  });
});
