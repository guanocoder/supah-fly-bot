var telegram = require("../../api/telegram");

var Handler = function() {};

const matchPattern = /kit\s\"([^\"]+)\"/g;

Handler.prototype.canHandle = function(update) {
    if(update && update.inline_query) {
        if(matchPattern.test(update.inline_query.query)) {
            return true;
        }
    }
    return false;
};

Handler.prototype.handle = function(update) {
    let photo_url = `http://afternoon-everglades-97004.herokuapp.com/render/kit/${encodeURI(update.inline_query.query)}`;
    return telegram.answerInlineQuery(update.inline_query.id, JSON.stringify(
        {
            type: "photo",
            id: String(10000000 + parseInt(Math.random() * 10000000)),
            photo_url: photo_url,
            thumb_url: photo_url
        }
    ));
};

module.exports = Handler;
