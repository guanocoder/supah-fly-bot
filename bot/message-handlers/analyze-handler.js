"use strict";
// Lets users associate an image, gif or sticker with a keyword

var telegram = require("../../api/telegram");
const { detectEmotions } = require('../../api/ndlapi');

var Handler = function() {};
let userContext = {};

Handler.prototype.canHandle = function(update) {
    if(update && update.message) {
        if(update.message.text && update.message.text.toLowerCase().startsWith("/analyze")) {
            // Any users who sends this command should be processed by this handler
            return true;
        } else {
            // User hasn't sent '/analyze' command, but he might already be in inputting state
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

Handler.prototype.handle = function(update) {
    return new Promise((resolve, reject) => {
        if(update && update.message && update.message.from && update.message.from.id) {
            let context = userContext[update.message.from.id];
            if(context === undefined) {
                userContext[update.message.from.id] = context = {
                    state: "indifferent"
                };
            }
            if(context.state == "indifferent") {
                if(update.message.text && update.message.text.toLowerCase().startsWith("/analyze")) {
                    resolve(
                        telegram.sendMessage(update.message.chat.id, "send me a photograph to analyze").then(() => {
                            context.state = "inputtingMedia";
                        })
                    );
                } else {
                    reject("Error 45: The unthinkable code is reached!");
                }
            } else if(context.state == "inputtingMedia") {
                if(update.message.photo && update.message.photo.length > 0) {
                    context.type = "photo";
                    // I don't know, just pick the last one (assuming they are ordered by size, we pick the key to the largest file)
                    context.file_id = update.message.photo[update.message.photo.length - 1].file_id;
                    resolve(
                        detectEmotions(context.file_id).then(faces => {
                            if (faces && faces.length > 1) {
                                return telegram.sendMessage(update.message.chat.id, "Which one of you is you?").then(() => {
                                    delete context.type;
                                    delete context.file_id;
                                    context.state = "indifferent";
                                });
                            } else if (faces && faces.length == 1) {
                                const loggedLines = [];
                                for(emotion in faces[0].emotions) {
                                    loggedLines.push(`<code>${emotion}: ${faces[0].emotions[emotion]}%</code>`);
                                }
                                return telegram.sendMessage(update.message.chat.id, loggedLines.join("\n")).then(() => {
                                    delete context.type;
                                    delete context.file_id;
                                    context.state = "indifferent";
                                });    
                            } else {
                                return telegram.sendMessage(update.message.chat.id, "looks like emotions detector API is down!").then(() => {
                                    delete context.type;
                                    delete context.file_id;
                                    context.state = "indifferent";
                                });
                            }
                        })
                    )
                } else {
                    // might have some leftovers from the last input operation
                    delete context.type;
                    delete context.file_id;
                }
                if(context.type == undefined) {
                    resolve(
                        telegram.sendMessage(update.message.chat.id, "I cannot analyze this! try a photo this time!")
                    )
                }       
            } else {
                reject("Error 54: The unthinkable code is reached!");
            }
        } else {
             reject("Could not resolve who this message is from");
        }
    });
};

module.exports = Handler;

