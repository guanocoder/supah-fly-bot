var telegram = require("../../api/telegram");

var InlineMarkupHandler = function() {};

var isCallbackQuery = false;
var messageText = "Сделай выбор!";

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
        let showAlert = (data == "withNotification") ? true : false;
        let userName = update.callback_query.from.username;
        let messageText = `@${userName} сделал свой выбор и теперь может заткнуться!`;
        return new Promise((resolve, reject) => {
            resolve(
                telegram.answerCallbackQuery(update.callback_query.id, messageText, showAlert)
            )
        });
    }
    return new Promise((resolve, reject) => {
        resolve(
            telegram.sendMessage(update.message.chat.id, messageText, null, JSON.stringify({
                "inline_keyboard" : [
                    [{
                        text: "обычно",
                        callback_data: "normal"
                    }, {
                        text: "с нотификацией",
                        callback_data: "withNotification"
                    }]
                ]                
            }))
        );
    });
}

module.exports = InlineMarkupHandler;