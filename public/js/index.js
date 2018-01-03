var socket = io();
socket.on('connect', function () {
  console.log('Connected to server');
});
socket.on('disconnect', function () {
  console.log('disconnected from server');
});


socket.on('newMessage', function (msg){
  console.log('New Message', JSON.stringify(msg));
  var p = document.createElement('p');
  p.innerText=msg.from + ' ' + msg.createdAt + ': ' + msg.text;
  document.body.appendChild(p);
});

socket.emit('createMessage', {
  from: 'jen@example.com',
  text: 'hello world',
  createdAt: new Date()
});
