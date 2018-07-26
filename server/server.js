const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

// local modules
const {generateMessage, generateLocationMessage} = require('./utils/message.js');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const port = process.env.PORT || 3000;
// path module eliminates redundant folder nav
const publicPath = path.join(__dirname, '../public');

const app = express();
// the following method is also called by app.listen (by express)
const server = http.createServer(app);

const io = socketIO(server);

let users = new Users();

// use on() method to add event listeners in socketIO
// eg. when a new connection is detected, log a message
// fires when the io() function runs in index.html
// likely the only listener you will attach to io
io.on('connection', (socket) => {
  console.log('New user connection');

  // three methods of interest:
  // io.emit and io.to('room-name').emit ==> sends data to all sockets in a room
  // socket.broadcast.emit and socket.broadcast.to('room').emit ==> sends data to all OTHER sockets in room
  // socket.emit ==> send something to a specific users

  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name required.');
    }
    socket.join(params.room);
    // precautionary
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('updateUserList', users.getUsersInRoom(params.room));

    // emit a private message from admin welcoming user
    socket.emit('newMessage', generateMessage('Admin', `Welcome to the chat, ${params.name}. Introduce yourself!`));
    // broadcast a message to others that the user joined
    // this emits the event to all socket except this one
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} joined the chat`));
    return callback();
  });

  socket.on('createMessage', (msg, callback) => {
    // io.emit sends an event message to ALL open sockets
    io.emit('newMessage', generateMessage(msg.from, msg.text));
    callback('Message transmitted succesfully');
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  // attach individual event listeners for each connection
  socket.on('disconnect', () => {
    const removedUser = users.removeUser(socket.id);
    if (removedUser) {
      io.to(removedUser.room).emit('updateUserList', users.getUsersInRoom(removedUser.room));
      io.to(removedUser.room).emit('newMessage', generateMessage('Admin', `${removedUser.name} has left the chat.`));
    }
  });
});


app.use(express.static(publicPath));

// get ready to accept new websocket connections
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
