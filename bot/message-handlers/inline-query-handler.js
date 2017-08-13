var telegram = require("../../api/telegram");

var InlineQueryHandler = function() {};

// ReplyKeyboardMarkup example
InlineQueryHandler.prototype.canHandle = function(update) {
    if(update && update.inline_query) {
        return true;
    }
    return false;
};

InlineQueryHandler.prototype.handle = function(update) {
    return new Promise((resolve, reject) => {
        resolve(
            telegram.answerInlineQuery(update.inline_query.id, [
                JSON.stringify(
                    {
                        type: "sticker",
                        id: 10000 + parseInt(Math.random() * 10000),
                        sticker_file_id: "CAADAgADqQADWQMDAAE8ExBJs_WvHAI"
                    }
                )
            ])
        );
    });
};

module.exports = InlineQueryHandler;