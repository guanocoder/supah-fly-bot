var telegram = require("../../api/telegram");

var InlineMarkupHandler = function() {};

var isCallbackQuery = false;
var messageText = "Как тебе сказать?";

// InlineKeyboardMarkup example
InlineMarkupHandler.prototype.canHandle = function(update) {
    if(update && update.message && update.message.text) {
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
        let callbackId = update.callback_query.id;
        let chatId = update.callback_query.message.chat.id;
        let data = update.callback_query.data;
        let userName = update.callback_query.from.username;
        let messageText = `@${userName} заткнись!`;

        if (data == "notification") {
            return new Promise((resolve, reject) => {
                resolve(
                    telegram.answerCallbackQuery(callbackId, messageText)
                );
            });
        } else if (data == "alert") {
            return new Promise((resolve, reject) => {
                resolve(
                    telegram.answerCallbackQuery(callbackId, messageText, true)
                );
            });
        } else {
            return new Promise((resolve, reject) => {
                resolve(
                    telegram.answerCallbackQuery(callbackId).then(() => {
                        return telegram.sendMessage(chatId, messageText);
                    })
                );
            });
        }
    }
    return new Promise((resolve, reject) => {
        resolve(
            telegram.sendMessage(update.message.chat.id, messageText, null, JSON.stringify({
                "inline_keyboard" : [
                    [{
                        text: "обычно",
                        callback_data: "normal"
                    }, {
                        text: "нотификацией",
                        callback_data: "notification"
                    }, {
                        text: "диалогом",
                        callback_data: "alert"
                    }]
                ]                
            }))
        );
    });
}

module.exports = InlineMarkupHandler;