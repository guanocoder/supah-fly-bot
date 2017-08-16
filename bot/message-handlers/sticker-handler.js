var telegram = require("../../api/telegram");

var StickerHandler = function() {};

StickerHandler.prototype.canHandle = function(update) {
    if(update && update.message && update.message.sticker) {
        return true;
    }
    return false;
}

StickerHandler.prototype.handle = function(update) {
    return Promise.resolve(); // just respond with an empty resolved promise without doing anything.
}

module.exports = StickerHandler;
