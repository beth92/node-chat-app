var socket = io();
socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('disconnected from server');
});

socket.on('newMessage', function (msg){
  // var li = $('<li></li>');
  var formattedTime = moment(msg.createdAt).format(' h:mma ');
  // li.text(formattedTime + msg.from + ': ' + msg.text);
  // $('#messages').append(li);

  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    text: msg.text,
    from: msg.from,
    createdAt: formattedTime
  });
  $('#messages').append(html);
});

socket.on('newLocationMessage', function(msg) {
  // var li = $('<li></li>');
  // var a = $('<a target="_blank"> My Current Location </a>');
  var formattedTime = moment(msg.createdAt).format(' h:mma ');
  var template = $('#location-message-template').html();
  // li.text(formattedTime + msg.from + ': ');
  // a.attr('href', msg.url);
  // li.append(a);
  // $('#messages').append(li);
  var html = Mustache.render(template, {
    url: msg.url,
    from: msg.from,
    createdAt: formattedTime
  });
  $('#messages').append(html);
});

$('#message-form').on('submit', function (e) {
  // prevent default behavior of submit event (refresh)
  e.preventDefault();

  var messageTextbox = $('[name=message]');

  socket.emit('createMessage', {
    from: 'user',
    text: messageTextbox.val(),
    createdAt: new Date().getTime()
  }, function () {
    // clear text input when message sent
    messageTextbox.val('');
  });
});

$('#send-location').on('click', function(){
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }
  var locationBtn = $(this);
  locationBtn.attr('disabled', 'disabled').text('Sending location...');
  navigator.geolocation.getCurrentPosition(function(position) {
    locationBtn.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  },function() {
    locationBtn.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
