'use strict';

var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var SupahFlyBot = require("./bot/supah-fly-bot.js");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var port = process.env.PORT || 8080;
var botToken = process.env.BOT_TOKEN || "AbcEEE";

var updates = [];

// for local testing purposes
app.post('/test', (request, response) => {
    var bot = new SupahFlyBot();
    bot.process(request.body)
    .catch(error => {
        console.log("Error: " + error);
    });
    response.end();
});

// handle telegram webhook requests that supply bot with updates
app.post(`/${botToken}`, (request, response) => {
    updates.push(request.body);
    var bot = new SupahFlyBot();
    bot.process(request.body)
    .catch(error => {
        console.log("Error: " + error);
    });
    response.end();
});

// return as JSON all the recent updates from telegram, at least those from the last app restart 
app.get('/getUpdates', (request, response) => {
    response.json(updates);
});

// render static content from www folder
app.use(express.static('www'));
// any other unknown request will get index.html rendered
app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, 'www/index.html'));
});

// start this whole thing up
app.listen(port, () => {
    console.log("Supah fly bot listening...");
});