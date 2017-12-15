var telegram = require("../../api/telegram");
var database = require("../../api/database");

var Handler = function() {};

Handler.prototype.canHandle = function(update) {
    let message = update.message || update.edited_message;
    if(message && message.text && message.text.toLowerCase().startsWith("/exec")) {
        if(message.from && message.from.id && process.env.USERS_EXEC_PERMISSION) {
            let allowed_users = process.env.USERS_EXEC_PERMISSION.split(",");
            for(let index in allowed_users) {
                if(message.from.id == allowed_users[index]) {
                    return true;
                }
            }
        }
    }
    return false;
}

Handler.prototype.handle = function(update) {
    let message = update.message || update.edited_message;
    let result = "";
    try {
        result = String(eval(message.text.substring(5)));
    } catch(error) {
        result = String(error);
    }
    return telegram.sendMessage(message.chat.id, result, (update.edited_message) ? update.edited_message.message_id : undefined)
        .catch(error => {
            console.log("Error: could not send /exec response via telegram sendMessage() - " + error)
        });
}

module.exports = Handler;
