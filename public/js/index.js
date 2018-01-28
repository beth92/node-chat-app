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

socket.on('newLocationMessage', function(msg) {
  var li = $('<li></li>');
  var a = $('<a target="_blank"> My Current Location </a>');
  li.text(msg.from + ': ');
  a.attr('href', msg.url);
  li.append(a);
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

$('#send-location').on('click', function(){
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(function(position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  },function() {
  alert('Unable to fetch location.');
});
});
