var telegram = require("../../api/telegram");

var InlineMarkupHandler = function() {};

var isCallbackQuery = false;
var messageText = "Make your choice!";

// InlineKeyboardMarkup example
InlineMarkupHandler.prototype.canHandle = function(update) {
    if(update && update.message) {
        if(update.message.text.toLowerCase().startsWith("/inlinemarkup")) {
            return true;
        }
    }
    // callback_query returned if user tapped on any of the buttons 
    if(update && update.callback_query &&
        update.callback_query.message && update.callback_query.message.text == messageText) {
            isCallbackQuery = true;
            return true;
        }
    return false;
}

InlineMarkupHandler.prototype.handle = function(update) {
    if(isCallbackQuery) {
        let chatId = update.callback_query.message.chat.id;
        let data = update.callback_query.data;
        let userName = update.callback_query.from.username;
        let messageText = `@${userName} have chosen '${data}'`;
        return new Promise((resolve, reject) => {
            resolve(
                telegram.sendMessage(chatId, messageText)
            )
        });
    }
    return new Promise((resolve, reject) => {
        resolve(
            telegram.sendMessage(update.message.chat.id, messageText, null, JSON.stringify({
                "inline_keyboard" : [
                    [{
                        text: "First Choice",
                        callback_data: "choice 1"
                    }, {
                        text: "Second Choice",
                        callback_data: "choice 2"
                    }]
                ]                
            }))
        );
    });
}

module.exports = InlineMarkupHandler;