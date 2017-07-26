var telegram = require("../../api/telegram");

var ReplyMarkupHandler = function() {};

// ReplyKeyboardMarkup example
ReplyMarkupHandler.prototype.canHandle = function(update) {
    if(update && update.message) {
        if(update.message.text.toLowerCase().startsWith("/replymarkup")) {
            return true;
        }
    }
    return false;
}

ReplyMarkupHandler.prototype.handle = function(update) {
    return new Promise((resolve, reject) => {
        resolve(
            telegram.sendMessage(update.message.chat.id, "Make your choice!", null, JSON.stringify({
                "keyboard": [
                    ["first", "second", "third"]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }))
        );
    });
}

module.exports = ReplyMarkupHandler;