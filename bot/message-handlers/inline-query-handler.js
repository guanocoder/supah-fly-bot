var telegram = require("../../api/telegram");
var database = require("../../api/database");

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
        database.lookupResults(update.inline_query.query.toLowerCase()).then((result) => {
            // database lookup query always returns results, even if no match is found
            let inlineChoices = result.rows.map((row) => {
                let resultItem = {
                    type: row.type,
                    id: String(10000000 + parseInt(Math.random() * 10000000))
                };
                switch(row.type) {
                    case "sticker":
                        resultItem.sticker_file_id = row.file_id;
                        break;
                    case "mpeg4_gif":
                        resultItem.mpeg4_file_id = row.file_id;
                        break;
                    case "photo":
                        resultItem.photo_file_id = row.file_id;
                        break;
                    default:
                        return null;
                        break;
                }
                return resultItem;
            });        

            resolve(telegram.answerInlineQuery(update.inline_query.id, JSON.stringify(inlineChoices)));

        }).catch((error) => {
            reject(error);
        });
    });
};

module.exports = InlineQueryHandler;
