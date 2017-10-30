var InlineQueryRenderHandler = require("./message-handlers/inline-query-render-handler.js");
var InlineQueryHandler = require("./message-handlers/inline-query-handler");
var InlineMarkupHandler = require('./message-handlers/inline-markup-handler');
var ReplyMarkupHandler = require('./message-handlers/reply-markup-handler');
var InputHandler = require('./message-handlers/input-handler');
var ChosenInlineResultHandler = require('./message-handlers/chosen-inline-result-handler');
var OmfgHandler = require('./message-handlers/omfg-handler');
var DefaultHandler = require('./message-handlers/default-handler');

let renderImageSettings = [];
let messageHandlers = [];

var SupahFlyBot = function(imageSet) {
    renderImageSettings = imageSet
    messageHandlers = [
        new InlineQueryRenderHandler(),
        new InlineQueryHandler(renderImageSettings),
        new InlineMarkupHandler(),
        new ReplyMarkupHandler(),
        new InputHandler(),
        new ChosenInlineResultHandler(),
        new OmfgHandler(),
        new DefaultHandler()
    ];
};

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