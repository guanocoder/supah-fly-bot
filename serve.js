'use strict';

var http = require('http');

http.createServer(function(request, response) {
    response.writeHead(200);
    response.write("<html><body><p>Wazzup?</p></body></html>");
    response.end();
})

.listen(80, '127.0.0.1');

console.log("Supah fly bot listening...");