var telegram = require("../../api/telegram");
var database = require("../../api/database");

var Handler = function() {};

Handler.prototype.canHandle = function(update) {
    if(update && update.message && update.message.text.toLowerCase().startsWith("/exec ")) {
        return true;
    }
    return false;
}

Handler.prototype.handle = function(update) {
    let result = "";
    try {
        result = eval(update.message.text.substring(6));
    } catch(error) {
        result = error.toString();
    }
    return telegram.sendMessage(update.message.chat.id, result);
}

module.exports = Handler;
