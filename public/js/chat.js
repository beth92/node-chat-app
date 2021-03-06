var socket = io();

function scrollToBottom() {
  // selectors
  var messages = $('#messages');
  var newMessage = messages.children('li:last-child');
  // heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      // TODO:
    }
  });
});

socket.on('disconnect', function () {
  console.log('disconnected from server');
});

socket.on('updateUserList', function(users) {
  var ul = jQuery('<ul></ul>');
  users.forEach(function(user) {
    ul.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ul);
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
  scrollToBottom();
});

socket.on('newLocationMessage', function(msg) {
  var formattedTime = moment(msg.createdAt).format(' h:mma ');
  var template = $('#location-message-template').html();
  var html = Mustache.render(template, {
    url: msg.url,
    from: msg.from,
    createdAt: formattedTime
  });
  $('#messages').append(html);
  scrollToBottom();
});

$('#message-form').on('submit', function (e) {
  // prevent default behavior of submit event (refresh)
  e.preventDefault();

  var messageTextbox = $('[name=message]');

  socket.emit('createMessage', {
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
