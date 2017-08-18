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
        database.lookupResults[update.inline_query.query.toLowerCase()].then((results) => {
            // return this bunch of choices if no match is found
            if(!Array.isArray(results)) {
                results =
                    inlineDictionary["stfu"]
                    .concat(inlineDictionary["blah"])
                    .concat(inlineDictionary["no care"])
                    .concat(inlineDictionary["gtfo"])
                    .concat(inlineDictionary["nothing to say"])
                    .concat(inlineDictionary["suck"]);
            }

            let inlineChoices = results.map((choiceItem) => {
                let resultItem = {
                    type: choiceItem.type,
                    id: String(10000000 + parseInt(Math.random() * 10000000))
                };
                switch(choiceItem.type) {
                    case "sticker":
                        resultItem.sticker_file_id = choiceItem.file_id;
                        break;
                    case "mpeg4_gif":
                        resultItem.mpeg4_file_id = choiceItem.file_id;
                        break;
                    case "photo":
                        resultItem.photo_file_id = choiceItem.file_id;
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
