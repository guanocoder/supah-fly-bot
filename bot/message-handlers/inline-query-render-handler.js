var telegram = require("../../api/telegram");

var Handler = function() {};

const matchPattern = /kit\s\"([^\"]+)\"/;

Handler.prototype.canHandle = function(update) {   
    if(update && update.inline_query) {
        if(matchPattern.test(update.inline_query.query)) {
            return true;
        }
    }
    return false;
};

Handler.prototype.handle = function(update) {
    
    // extract from bot inline query command text that we want to render
    let match = matchPattern.exec(update.inline_query.query);

    // url of an image with a rendered text
    // TODO: find out how to get this URL from server context
    let serviceUrl = "http://afternoon-everglades-97004.herokuapp.com";
    let photo_url = `${serviceUrl}/render/kit?text=${encodeURIComponent(match[1])}`;
    let thumb_url = `${serviceUrl}/render/thumb/kit?text=${encodeURIComponent(match[1])}`;
    return telegram.answerInlineQuery(update.inline_query.id, JSON.stringify(
        [{
            type: "photo",
            id: String(10000000 + parseInt(Math.random() * 10000000)),
            photo_url: photo_url,
            thumb_url: thumb_url
        }]
    ));
};

module.exports = Handler;
