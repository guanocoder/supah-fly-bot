var telegram = require("../../api/telegram");
var database = require("../../api/database");

var InlineQueryHandler = function() {};

function getInlineChoicesFromDbResults(result) {
    return result.rows.map((row) => {
        let resultItem = {
            type: row.type,
            id: row.file_id
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
}

// ReplyKeyboardMarkup example
InlineQueryHandler.prototype.canHandle = function(update) {
    if(update && update.inline_query) {
        return true;
    }
    return false;
};

InlineQueryHandler.prototype.handle = function(update) {
    return new Promise((resolve, reject) => {
        if(update.inline_query.query.trim().length == 0) {
            database.getMostPopular().then((result) => {
                resolve(telegram.answerInlineQuery(update.inline_query.id, JSON.stringify(getInlineChoicesFromDbResults(result))));
            }).catch((error) => {
                reject(error);
            });
        } else {
            database.lookupResults(update.inline_query.query.toLowerCase()).then((result) => {
                resolve(telegram.answerInlineQuery(update.inline_query.id, JSON.stringify(getInlineChoicesFromDbResults(result))));
            }).catch((error) => {
                reject(error);
            });
        }
    });
};

module.exports = InlineQueryHandler;
