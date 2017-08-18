"use strict";
// Lets users associate an image, gif or sticker with a keyword

var telegram = require("../../api/telegram");
var database = require("../../api/database");

var InputHandler = function() {};
let userContext = {};

InputHandler.prototype.canHandle = function(update) {
    if(update && update.message) {
        if(update.message.text && update.message.text.toLowerCase().startsWith("/input")) {
            // Any users who sends this command should be processed by this handler
            return true;
        } else {
            // User hasn't sent '/input' command, but he might already be in inputting state
            if(update.message.from) {
                let context = userContext[update.message.from.id];
                if(context && context.state && (context.state == "inputtingMedia" || context.state == "inputtingKeyword")) {
                    return true;
                }
            }
        }   
    }
    return false;
};

InputHandler.prototype.handle = function(update) {
    return new Promise((resolve, reject) => {
        if(update && update.message && update.message.from && update.message.from.id) {
            let context = userContext[update.message.from.id];
            if(context === undefined) {
                userContext[update.message.from.id] = context = {
                    state: "indifferent"
                };
            }
            if(context.state == "indifferent") {
                if(update.message.text && update.message.text.toLowerCase().startsWith("/input")) {
                    resolve(
                        telegram.sendMessage(update.message.chat.id, "send me your incredibly funny picture, sticker or GIF").then(() => {
                            context.state = "inputtingMedia";
                        })
                    );
                } else {
                    reject("Error 45: The unthinkable code is reached!");
                }
            } else if(context.state == "inputtingMedia") {
                if(update.message.sticker) {
                    context.type = "sticker";
                    context.file_id = update.message.sticker.file_id;
                } else if(update.message.document && update.message.document.mime_type == "video/mp4") {
                    context.type = "mpeg4_gif";
                    context.file_id = update.message.document.file_id;
                } else if(update.message.photo && update.message.photo.length > 0) {
                    context.type = "photo";
                    // I don't know, just pick the last one (assuming they are ordered by size, we pick the key to the largest file)
                    context.file_id = update.message.photo[update.message.photo.length - 1].file_id;
                } else {
                    // might have some leftovers from the last input operation
                    delete context.type;
                    delete context.file_id;
                }
                if(context.type == undefined) {
                    resolve(
                        telegram.sendMessage(update.message.chat.id, "This is not a picture or a sticker or a GIF!")
                    )
                } else {
                    resolve(
                        telegram.sendMessage(update.message.chat.id, "Now send in your remarkably smart key word to bind to this item!").then(() => {
                            context.state = "inputtingKeyword";
                        })
                    );
                }       
            } else if(context.state == "inputtingKeyword") {
                if(update.message.text) {
                    resolve(
                        database.addKeyword(update.message.text.toLowerCase()).then(() => {
                            return database.addResult(context.type, context.file_id);
                        }).then(() => {
                            return database.addKeywordResult(update.message.text.toLowerCase(), context.file_id);
                        }).then(() => {
                            return telegram.sendMessage(update.message.chat.id, "Who's your daddy!?");
                        }).then(() => {
                            context.state = "indifferent";
                        })
                    );
                } else {
                    resolve(
                        telegram.sendMessage(update.message.chat.id, "Whazzup man? Can't you spell?")
                    );
                }
            } else {
                reject("Error 54: The unthinkable code is reached!");
            }
        } else {
             reject("Could not resolve who this message is from");
        }
    });
};


module.exports = InputHandler;
