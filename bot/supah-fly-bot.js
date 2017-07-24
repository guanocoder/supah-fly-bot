var DefaultHandler = require('./message-handlers/default-handler')
var SupahFlyBot = function() {};

var messageHandlers = [
    new DefaultHandler()
];
// Process telegram update brought through bot webhook
SupahFlyBot.prototype.process = function(update) {
    return new Promise((resolve, reject) => {
        var isProcessed = false;
        for(var index = 0; index < messageHandlers.length; index++) {
            var messageHandler = messageHandlers[index];
            if(messageHandler.canHandle(update)) {
                isProcessed = true;
                resolve(messageHandler.handle(update));
                break;
            }
        }
        if(!isProcessed) {
            reject("No appropriate message handler found!");
        }
    });
}

module.exports = SupahFlyBot;