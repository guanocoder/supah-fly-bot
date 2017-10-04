var telegram = require("../../api/telegram");
var database = require("../../api/database");

let renderImageSettings = [];

var InlineQueryHandler = function(imageSet) {
    renderImageSettings = imageSet
};

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
            let imageRenderResults = getTextRenderResults(update.inline_query.query)
            // 50 is Telegrams limit for inline query results
            let rowCount = 50 - imageRenderResults.length;
            database.lookupResults(update.inline_query.query.toLowerCase(), rowCount).then((result) => {
                resolve(telegram.answerInlineQuery(update.inline_query.id,
                    JSON.stringify(imageRenderResults.concat(getInlineChoicesFromDbResults(result)))
                ));
            }).catch((error) => {
                reject(error);
            });
        }
    });
};

function getTextRenderResults(text) {
    // TODO: find out how to get this URL from server context
    let serviceUrl = "http://afternoon-everglades-97004.herokuapp.com";
    return Object.keys(renderImageSettings).map(imageKey => {
        return {
            type: "photo",
            id: String(10000000 + parseInt(Math.random() * 10000000)),
            photo_url: `${serviceUrl}/render/${imageKey}/${encodeURIComponent(text)}`,
            thumb_url: `${serviceUrl}/render/thumb/${imageKey}/${encodeURIComponent(text)}`
        };
    });
}

module.exports = InlineQueryHandler;
