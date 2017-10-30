var telegram = require("../../api/telegram");

var Handler = function() {};

Handler.prototype.canHandle = function(update) {
    if(update && update.message && update.message.photo) {
        return true;
    }
    return false;
}

Handler.prototype.handle = function(update) {
    return telegram.sendPhoto(update.message.chat.id, "http://people.sc.fsu.edu/~jburkardt/data/png/baboon.png");
}

module.exports = Handler;
