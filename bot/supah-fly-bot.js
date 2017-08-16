var InlineQueryHandler = require("./message-handlers/inline-query-handler");
var InlineMarkupHandler = require('./message-handlers/inline-markup-handler');
var ReplyMarkupHandler = require('./message-handlers/reply-markup-handler');
var StickerHandler = require('./message-handlers/sticker-handler');
var DocumentHandler = require('./message-handlers/document-handler');
var PhotoHandler = require('./message-handlers/photo-handler');
var DefaultHandler = require('./message-handlers/default-handler');
var SupahFlyBot = function() {};

var messageHandlers = [
    new InlineQueryHandler(),
    new InlineMarkupHandler(),
    new ReplyMarkupHandler(),
    new DocumentHandler(),
    new StickerHandler(),
    new PhotoHandler(),
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