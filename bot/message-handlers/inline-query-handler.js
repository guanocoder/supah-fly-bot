var telegram = require("../../api/telegram");
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
        let inlineChoices = inlineDictionary[update.inline_query.query];

        while(typeof(inlineChoices) == "string") {
            inlineChoices = inlineDictionary[inlineChoices];
        }

        if(!Array.isArray(inlineChoices)) {
            inlineDictionary =
                inlineDictionary["stfu"]
                .concat(inlineDictionary["blah"])
                .concat(inlineDictionary["no care"])
                .concat(inlineDictionary["gtfo"])
                .concat(inlineDictionary["nothing to say"]);
        }

        inlineChoices.map((choiceItem) => {
            chiceItem.id = String(10000000 + parseInt(Math.random() * 10000000));
            switch(choiceItem.type) {
                case "sticker":
                    choiceItem.sticker_file_id = choiceItem.file_id;
                    break;
                case "mpeg4_gif":
                    choiceItem.mpeg4_file_id = choiceItem.file_id;
                    break;
                default:
                    return null;
                    break;
            }
            delete choiceItem.file_id;
            return choiceItem;
        });
        
        resolve(
            telegram.answerInlineQuery(update.inline_query.id, 
                JSON.stringify(inlineChoices)
            )
        );
    });
};

module.exports = InlineQueryHandler;
