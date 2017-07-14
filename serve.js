'use strict';

var express = require('express');
var path = require('path');
var app = express();
var requestModule = require('request');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var port = process.env.PORT || 8080;
var botToken = process.env.BOT_TOKEN || "AbcEEE";

var updates = [];

app.post(`/${botToken}`, (request, response) => {
    updates.push(request.body);
    response.end();
    if(request.body.message) {
        setTimeout(() => {
            requestModule.post({
                url: `https://api.telegram.org/bot${botToken}/sendMessage`,
                form: {
                    chat_id : request.body.message.chat.id,
                    text: "заткнись!",
                    reply_to_message_id: request.body.message.message_id
                }
            }, (error, response, body) => {
                if(error) {
                    console.log("Error: " + error);
                }
            });
        }, 1000 + Math.round(Math.random()*2000));
    }
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