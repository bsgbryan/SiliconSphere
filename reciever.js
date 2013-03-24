var client = require('socket.io-client'),
    socket = client.connect('localhost', { reconnect: true, port: 3001 }),
    fs     = require('fs'),
    writers = { },
    completed = [ ]

function home(loc) {
  return '/tmp/' + loc.app + loc.name
}

socket.on('connect', function () {
  console.log('Connected to distributor')
})

socket.on('push app', function (app) {
  if (fs.existsSync('/tmp/' + app.name) === false)
    fs.mkdir('/tmp/' + app.name)
})

socket.on('make dir', function (dir) {
  if (fs.existsSync(home(dir)) === false)
    fs.mkdir(home(dir))
})

socket.on('create file', function (info) {
  writers[info.name] = fs.createWriteStream(home(info))
})

socket.on('recieve buffer', function (file) {
  writers[file.name].write(new Buffer(file.data))
})

socket.on('writing done', function (file) {
  writers[file.name].end()
  completed.push(file.name)

  if (Object.keys(writers).length === completed.length) {
    if (fs.existsSync('/tmp/' + file.app + '/mesh.js')) {
      console.log('Executing mesh.js')
      require('/tmp/' + file.app + '/mesh')

      completed = [ ]
      writers   = { }
      
      socket.emit('push completed')
    }
  }
})