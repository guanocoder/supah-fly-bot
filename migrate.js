'use strict';

//process.env["DATABASE_URL"] = "";

var database = require('./api/database');
var inlineDictionary = require("./bot/message-handlers/inline-dictionary");

Object.keys(inlineDictionary).forEach((keyword) => {
    console.log("Adding keyword: " + keyword);
    database.addKeyword(keyword).then((response) => {
        console.log("Keyword successfully added: " + JSON.stringify(response));
    }).catch((error) => {
        console.log("Error adding keyword: " + error);
    })
});