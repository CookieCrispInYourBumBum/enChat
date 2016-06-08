/*
* enChat - An encrypted chat application created for NodeJS
* Version: 0.3 BETA
* 
* GitHub Page: https://github.com/enChat/enChat
* Contact: enchat@users.noreply.github.com
*/

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = 8151;
var version = '0.3 BETA'; // DO NOT CHANGE!!!
users = [];
connections = [];

server.listen(process.env.PORT || port);
console.log('enChat server is running!\r\nPort '+port+'\r\nVersion: '+version+'\r\nIt is recommended that you screen this server to keep it up when you go off');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
  // Connect
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  // Disconnect
  socket.on('disconnect', function(data){
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
  });

  // Send message
  socket.on('send message', function(data){
    io.sockets.emit('new message', {msg: data, user: socket.username});
  });

  // New user
  socket.on('new user', function(data, callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames(){
    io.sockets.emit('get users', users);
  }
});
