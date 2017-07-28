var telegram = require("../../api/telegram");

var DefaultHandler = function() {};

function simulateUserDelay(maximumDelayMiliseconds, minimumDelayMiliseconds) {
    return new Promise((resolve, reject) => {
        if(maximumDelayMiliseconds === null || maximumDelayMiliseconds <= 0)
            maximumDelayMiliseconds = 5000;
        if(minimumDelayMiliseconds === null)
            minimumDelayMiliseconds = 0;
        if(minimumDelayMiliseconds >= maximumDelayMiliseconds)
            reject("Minimum delay cannot be longer than or equal to maximum delay");
        var timer = minimumDelayMiliseconds + Math.round(Math.random() * (maximumDelayMiliseconds - minimumDelayMiliseconds));
        setTimeout(() => {
            resolve();
        }, timer);
    });
}

DefaultHandler.prototype.canHandle = function(update) {
    if(update && update.message) {
        return true;
    }
    return false;
}

DefaultHandler.prototype.handle = function(update) {
    return new Promise((resolve, reject) => {
        resolve(
            simulateUserDelay(5000, 1000).then(() => {
                return telegram.sendChatAction(update.message.chat.id, "typing");
            }).then(() => {
                return simulateUserDelay(5000, 3000);
            }).then(() => {
                return telegram.sendMessage(update.message.chat.id, "заткнись!", update.message.message_id, 
                    JSON.stringify({ hide_keyboard: true })
                );
            })
        );
    });
}

module.exports = DefaultHandler;