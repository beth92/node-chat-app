/* jshint esversion: 6 */

const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

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
io.on('connection', (socket) => {
  console.log('New user connection');

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
