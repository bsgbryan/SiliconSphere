var app    = require('express')(), 
    server = require('http').createServer(app), 
    io     = require('socket.io').listen(server),
    nodes  = { },
    // active = { },
    socket = null

io.set('log level', 1)

server.listen(3003)

// function fulfill(app, req, mess, res) {
//   console.log('Fulfilling', active[app])

//   nodes[app].forEach(function (item, i) {
//     if (active[app].indexOf(i) < 0) {
//       doFulfill(i, app, req, mess, res)
//     }
//   })
// }

// function doFulfill(i, app, action, input) {
//   function sendResult(result) {
//     var re = res

//     console.log(app + ':' + i + ':' + action + ':completed, sending', result)

//     if (typeof result.html === 'string') {
//       if (typeof res.get('Content-Type') === 'undefined') {
//         re.set('Content-Type', 'text/html')
//         console.log('Set content type')
//       }

//       re.send(result.html)
//     } else
//       re.send(result)

//     var index = active[app].indexOf(i)

//     active[app].splice(index, 1)

//     io.sockets.emit('mesh:audit.completed', { app: app, instance: i, action: mess })

//     re = null
//   }

//   socket.on(app + ':' + i + ':' + mess + ':completed', sendResult)

//   console.log('Calling', app + ':' + i + ':' + mess)

//   io.sockets.emit(app + ':' + i + ':' + mess, { args: mess })

//   io.sockets.emit('mesh:audit.called', { app: app, instance: i, action: mess })

//   active[app].push(i)
// }

io.of('/registrar').on('connection', function (socket) {

  socket.on('register module', function (app, cb) {
    if (typeof nodes[app.name] === 'undefined')
      nodes[app.name] = [ 0 ]
    else
      nodes[app.name].push(nodes[app.name].length)

    var address = nodes[app.name].length - 1

    console.log('Assigned unique address to module', app.name, address)

    cb(address)
  })

  socket.on('get module address', function (module, cb) {
    var index = Math.random(nodes[module.name].length - 1)

    cb(module.name + ':' + index)
  })
})

io.sockets.on('connection', function (s) {
  socket = s
})

// app.get('/:app/:action', function (req, res) {
//   var app  = req.param('app'),
//       mess = req.param('action')

//   if (typeof active[app] === 'undefined')
//     active[app] = [ ]

//   console.log('Active requests', active[app].length)

//   if (active[app].length === 0)
//     doFulfill(0, app, req, mess, res)
//   else
//     fulfill(app, req, mess, res)
// })