var telegram = require("../../api/telegram");
var database = require("../../api/database");
var inlineDictionary = require("./inline-dictionary");

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
            let inlineChoices = null;                        
            if(result == null || !Array.isArray(result.rows) || result.rows.length == 0) {
                // return this bunch of choices if no match is found
                inlineChoices = inlineDictionary["stfu"]
                    .concat(inlineDictionary["blah"])
                    .concat(inlineDictionary["no care"])
                    .concat(inlineDictionary["gtfo"])
                    .concat(inlineDictionary["nothing to say"])
                    .concat(inlineDictionary["suck"]);
            } else {
                inlineChoices = result.rows;
            }

            inlineChoices = inlineChoices.map((row) => {
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
