'use strict';

var http = require('http');
var host = '127.0.0.1';
if(process.env.NODE_ENV == 'production') {
    host = 'afternoon-everglades-97004.herokuapp.com';
}

http.createServer(function(request, response) {
    response.writeHead(200);
    response.write("<html><body><p>Wazzup?</p></body></html>");
    response.end();
})

.listen(80, host);

console.log("Supah fly bot listening...");