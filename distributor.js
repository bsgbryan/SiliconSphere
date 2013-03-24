var app    = require('express')(), 
    server = require('http').createServer(app), 
    io     = require('socket.io').listen(server)

io.set('log level', 0)

server.listen(3001)

io.sockets.on('connection', function (socket) {
  
  socket.on('push app', function (info) {
    io.sockets.emit('push app', info)
  })

  socket.on('create dir', function (dir) {
    io.sockets.emit('make dir', dir)
  })

  socket.on('push file', function (info, cb) {
    io.sockets.emit('create file', info)

    cb()
  })

  socket.on('push buffer', function (file) {
    io.sockets.emit('recieve buffer', file)
  })

  socket.on('file pushed', function (file) {
    io.sockets.emit('writing done', file)
  })

  socket.on('push completed', function () {
    io.sockets.emit('push completed')
  })
})