'use strict';

var express = require('express');
var path = require('path');
var app = express();
var port = 8080;
if(process.env.NODE_ENV == 'production') {
    port = process.env.PORT;
}

app.use(express.static('www'));
app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, 'www/index.html'));
});

app.listen(port, () => {
    console.log("Supah fly bot listening...");
});