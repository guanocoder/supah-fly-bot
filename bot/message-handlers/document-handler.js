var telegram = require("../../api/telegram");

var DocumentHandler = function() {};

DocumentHandler.prototype.canHandle = function(update) {
    if(update && update.message && update.message.document) {
        return true;
    }
    return false;
}

DocumentHandler.prototype.handle = function(update) {
    return Promise.resolve(); // just respond with an empty resolved promise without doing anything.
}

module.exports = DocumentHandler;
