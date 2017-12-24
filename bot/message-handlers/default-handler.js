var telegram = require("../../api/telegram");
var database = require("../../api/database");
var helper = require("./helper");

var DefaultHandler = function() {};

DefaultHandler.prototype.canHandle = function(update) {
    if(update && update.message) {
        return true;
    }
    return false;
}

DefaultHandler.prototype.handle = function(update) {
    return new Promise((resolve, reject) => {
        resolve(
            helper.delayPromise(5000, 2000).then(_ => {
                if(helper.isResultOfChosenInline(update)) {
                    // The problem is that we receive "chosen_inline_result" from telegram after
                    // the message update that was posted via @bots inline mode.
                    // So we wait at least 2 seconds and check if the message indeed is the result of inline mode selection.
                    // if it is, then bot should not respond.
                    return Promise.resolve(); 
                }
                return telegram.sendChatAction(update.message.chat.id, "typing").then(_ => {
                    return helper.delayPromise(5000, 3000);
                }).then(_ => {
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
