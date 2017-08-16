var telegram = require("../../api/telegram");

var PhotoHandler = function() {};

PhotoHandler.prototype.canHandle = function(update) {
    if(update && update.message && update.message.photo) {
        return true;
    }
    return false;
}

PhotoHandler.prototype.handle = function(update) {
    return Promise.resolve(); // just respond with an empty resolved promise without doing anything.
}

module.exports = PhotoHandler;