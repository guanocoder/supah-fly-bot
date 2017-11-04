var telegram = require("../../api/telegram");
var database = require("../../api/database");

var DefaultHandler = function() {};

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

DefaultHandler.prototype.canHandle = function(update) {
    if(update && update.message) {
        return true;
    }
    return false;
}

DefaultHandler.prototype.handle = function(update) {
    return new Promise((resolve, reject) => {
        resolve(
            simulateUserDelay(5000, 1000).then(() => {
                return telegram.sendChatAction(update.message.chat.id, "typing");
            }).then(() => {
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
            })
        );
    });
}

module.exports = DefaultHandler;
