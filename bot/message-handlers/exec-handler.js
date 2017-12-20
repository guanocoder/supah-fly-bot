var telegram = require("../../api/telegram");
var database = require("../../api/database");

var Handler = function() {};

Handler.__systemConsole = console;

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
    
    function TelegramConsoleImitation() {
        let loggedLines = [];
        return {
            anythingLogged: function() {
                return loggedLines.length > 0;
            },
            log: function(anything) {
                loggedLines.push(`<code>${anything}</code>`);
            },
            toString: function() {
                return loggedLines.join("\n");
            }
        }
    }

    function sendMessage(messageText) {
        return telegram.sendMessage(message.chat.id, messageText);
    }
    
    // '__' - prefix to minimize name conflict probability with whatever code that is about to be eval()-uated
    let __result = "";
    let console = new TelegramConsoleImitation();
    try {
        __result = String(eval(message.text.substring(5)));
    } catch(error) {
        __result = String(error);
    }
    __result = `<code>${__result}</code>`;
    return telegram.sendMessage(
            message.chat.id,
            (console.anythingLogged()) ? console.toString() : __result,
            (update.edited_message) ? update.edited_message.message_id : undefined, undefined, "HTML"
        ).catch(error => {
            this.__systemConsole.log("Error: could not send /exec response via telegram sendMessage() - " + error)
        });
}

module.exports = Handler;
