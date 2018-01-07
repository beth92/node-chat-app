/* jshint esversion: 6 */

const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

// local modules
const {generateMessage} = require('./utils/message.js');

const port = process.env.PORT || 3000;
// path module eliminates redundant folder nav
const publicPath = path.join(__dirname, '../public');

let app = express();
// the following method is also called by app.listen (by express)
let server = http.createServer(app);

let io = socketIO(server);

// use on() method to add event listeners in socketIO
// eg. when a new connection is detected, log a message
// fires when the io() function runs in index.html
// likely the only listener you will attach to io
io.on('connection', (socket) => {
  console.log('New user connection');

  // emit a private message from admin welcoming user
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat. Introduce yourself!'));

  // broadcast a message to others that the user joined
  // this emits the event to all socket except this one
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user joined the chat'));

  socket.on('createMessage', (msg, callback) => {
    // io.emit sends an event message to ALL open sockets
    io.emit('newMessage', generateMessage(msg.from, msg.text));
    callback('Message transmitted succesfully');
  });

  // attach individual event listeners for each connection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


app.use(express.static(publicPath));

// get ready to accept new websocket connections
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
