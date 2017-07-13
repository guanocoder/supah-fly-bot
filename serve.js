'use strict';

var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var port = process.env.PORT || 8080;
var botToken = process.env.BOT_TOKEN || "AbcEEE";

var updates = [];

app.post(`/${botToken}`, (request, response) => {
    updates.push({
        date: new Date(),
        query: request.query,
        params: request.params,
        body: request.body
    });
    response.end();    
});

app.get('/getUpdates', (request, response) => {
    response.json(updates);
});

app.use(express.static('www'));
app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, 'www/index.html'));
});

app.listen(port, () => {
    console.log("Supah fly bot listening...");
});