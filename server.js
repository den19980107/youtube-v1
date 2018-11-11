var express = require('express');
var socket = require('socket.io');
var app = express();
var server = app.listen(3000, function () {
  console.log("listen to 3000");
})
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.use(express.static('./'));
var io = socket(server);

io.on('connection', function (socket) {
  console.log("make socket connection");
  socket.on("message", function (obj) {
    console.log(obj);
    io.sockets.emit('message', obj);
  })

})