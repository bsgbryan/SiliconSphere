#!/usr/bin/env node
var fs  = require('fs'),
    client = require('socket.io-client'),
    socket = client.connect('localhost', { reconnect: true, port: 3001 })

function d(err) {
  if (err) {
    console.log('ERROR', err)
    process.exit()
  }
}

function drillInto(prefix, app, dir, socket) {
  if (arguments.length === 4)
    var location = prefix + '/' + dir
  else {
    var location = prefix
    socket       = dir
  }

  fs.readdir(location, function (err, files) {
    d(err)

    files.forEach(function (file) {
      if (file[0] !== '.')
        fs.stat(location + '/' + file, function (err, stats) {
          d(err)

          var chop = process.cwd().length,
              path = (location + '/' + file).substring(chop),
              dir  = { app: app, name: path }

          if (stats.isDirectory()) {
            socket.emit('create dir', dir)

            drillInto(location, app, file, socket)
          } else {
            socket.emit('push file', dir, function () {
              var reader = fs.createReadStream(location + '/' + file)

              reader.on('readable', function () {
                dir.data = reader.read()
                
                socket.emit('push buffer', dir)
              })

              reader.on('end', function () {
                socket.emit('file pushed', dir)
              })
            })
          }
        })
    })
  })
}

socket.on('connect', function () {
  var path = process.cwd().split('/'),
      app  = path[path.length - 1]

  socket.emit('push app', { name: app })

  drillInto(process.cwd(), app, socket)
})

socket.on('push completed', function () {
  console.log('Push completed')
  process.exit()
})