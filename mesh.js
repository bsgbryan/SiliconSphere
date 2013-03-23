var http      = require('http'),
    httpProxy = require('http-proxy')

httpProxy.createServer(function (req, res, proxy) {
  var buffer = httpProxy.buffer(req);

  //
  // TODO: Remove this timeout
  //
  setTimeout(function () {
    proxy.proxyRequest(req, res, {
      host: 'localhost',
      port: 9000, 
      buffer: buffer
    });      
  }, 2000);
}).listen(8000);

http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied: ' + req.url +'\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9000);

http.createServer()