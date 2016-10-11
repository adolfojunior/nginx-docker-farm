var http = require('http');

var port = process.env.PORT || 3000;
var name = process.env.APP || ('server' + Date.now());

var server = http.createServer(function(request, response) {
  response.writeHead(200, {
    'Content-Type': 'application/json'
  });
  response.write(JSON.stringify({
    name: name,
    env: process.env
  }));
  response.end();
});

server.listen(port, function() {
  console.log('Server working at http://localhost:' + port);
});
