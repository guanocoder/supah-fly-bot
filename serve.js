'use strict';

var http = require('http');
var port = 8080;
var host = '127.0.0.1';
if(process.env.NODE_ENV == 'production') {
    port = process.env.PORT;
    host = 'afternoon-everglades-97004.herokuapp.com';
}

http.createServer(function(request, response) {
    response.writeHead(200);
    response.write("<html><body><p>Wazzup?</p></body></html>");
    response.end();
})

.listen(port, host);

console.log("Supah fly bot listening...");