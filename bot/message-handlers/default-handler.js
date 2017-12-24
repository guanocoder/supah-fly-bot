var telegram = require("../../api/telegram");
var database = require("../../api/database");

// This array holds last chosen file_ids. All in order for bot to tell the difference
// between media sent via this same bot's @inline functionality or some unrelated content
var chosenItemTracker = null;
var DefaultHandler = function(sharedTracker) { // constructor
    chosenItemTracker = sharedTracker;
};

function simulateUserDelay(maximumDelayMiliseconds, minimumDelayMiliseconds) {
    return new Promise((resolve, reject) => {
        if(maximumDelayMiliseconds === null || maximumDelayMiliseconds <= 0)
            maximumDelayMiliseconds = 5000;
        if(minimumDelayMiliseconds === null)
            minimumDelayMiliseconds = 0;
        if(minimumDelayMiliseconds >= maximumDelayMiliseconds)
            reject("Minimum delay cannot be longer than or equal to maximum delay");
        var timer = minimumDelayMiliseconds + Math.round(Math.random() * (maximumDelayMiliseconds - minimumDelayMiliseconds));
        setTimeout(() => {
            resolve();
        }, timer);
    });
}

function checkIfBotsInlineModeGeneratedThisMessageThenWeDontHaveToRespond(update) {
    if(update.message && update.message.chat.type != "private") {
        if (update.message.sticker || update.message.photo || update.message.document) {
            let message = update.message;
            let fileId = chosenItemTracker[message.from.id];
            if(fileId) {
                if(message.sticker) {
                    return fileId == message.sticker.file_id;
                } else if (message.document) {
                    return fileId == message.document.file_id;
                } else if (message.photo) {
                    return (message.photo.find(item => item.file_id == fileId)) ? true : false;
                }
            }
        }
    }
    return false;
}

DefaultHandler.prototype.canHandle = function(update) {
    if(update && update.message) {
        return true;
    }
    return false;
}

DefaultHandler.prototype.handle = function(update) {
    return new Promise((resolve, reject) => {
        resolve(
            simulateUserDelay(5000, 2000).then(() => {
                if(checkIfBotsInlineModeGeneratedThisMessageThenWeDontHaveToRespond(update)) {
                    // The problem is that we receive "chosen_inline_result" from telegram after
                    // the message update that was posted via @bots inline mode.
                    // So we wait at least 2 seconds and check if the message indeed is the result of inline mode selection.
                    // if it is, then bot should not respond.
                    return Promise.resolve(); 
                }

                return telegram.sendChatAction(update.message.chat.id, "typing").then(() => {
                    return simulateUserDelay(5000, 3000);
                }).then(() => {
                    // return telegram.sendMessage(update.message.chat.id, "заткнись! мой хероку длиннее твоего!", update.message.message_id, 
                    //     JSON.stringify({ hide_keyboard: true })
                    // );
                    return database.lookupResults("stfu", 50).then(results => {
                        let index = parseInt(Math.random() * results.rows.length);
                        return results.rows[index];
                    });
                }).then(resultRow => {
                    let sendMethod = null;
                    switch(resultRow.type) {
                        case "sticker":
                            sendMethod = telegram.sendSticker;
                            break;
                        case "mpeg4_gif":
                            sendMethod = telegram.sendDocument;
                            break;
                        case "photo":
                            sendMethod = telegram.sendPhoto;
                            break;
                        default:
                            return reject("Have no idea how to send selected result from the database.")
                            break;
                    }
                    return sendMethod.call(telegram, update.message.chat.id, resultRow.file_id);
                });
            })
        );
    });
}

module.exports = DefaultHandler;
