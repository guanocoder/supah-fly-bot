var telegram = require("../../api/telegram");
var database = require("../../api/database");

var Handler = function() {};

Handler.prototype.canHandle = function(update) {
    if(update && update.message && update.message.text && update.message.text.toLowerCase().startsWith("/exec ")) {
        if(update.message.from && update.message.from.id && process.env.USERS_EXEC_PERMISSION) {
            let allowed_users = process.env.USERS_EXEC_PERMISSION.split(",");
            for(let index in allowed_users) {
                if(update.message.from.id == allowed_users[index]) {
                    return true;
                }
            }
        }
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
