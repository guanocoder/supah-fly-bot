'use strict';

var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var SupahFlyBot = require("./bot/supah-fly-bot.js");
var imageTextRenderer = require("./image-text-renderer/renderer.js");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var port = process.env.PORT || 8080;
var botToken = process.env.BOT_TOKEN || "AbcEEE";

var updates = [];

// This array shall hold last chosen file_ids. All in order for bot to tell the difference
// between media sent via this same bot's @inline functionality or some unrelated content
var chosenItemTracker = [];

// for local testing purposes
app.post('/test', (request, response) => {
    var bot = new SupahFlyBot(imageTextRenderer, chosenItemTracker);
    bot.process(request.body)
    .catch(error => {
        console.log("Error: " + error);
    });
    response.end();
});

// handle telegram webhook requests that supply bot with updates
app.post(`/${botToken}`, (request, response) => {
    updates.push(request.body);
    var bot = new SupahFlyBot(imageTextRenderer, chosenItemTracker);
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

app.use('/render', imageTextRenderer);

// render static content from www folder
app.use(express.static('www'));
// any other unknown request will get index.html rendered
app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, 'www/index.html'));
});

// start this whole thing up
app.listen(port, () => {
    console.log("Supah fly bot listening...");
    // Telegram inline query request times out when bot is sleeping and needs to wake up
    // so I am trying to cut waking delay by postponing resource preloading for the image renderer
    setTimeout(() => {
        imageTextRenderer.preload();
    }, 100)
});