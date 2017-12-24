var telegram = require("../../api/telegram");
var helper = require("./helper");

let imageRenderer = null;

var Handler = function(renderer) {
    imageRenderer = renderer;
};

Handler.prototype.canHandle = function(update) {
    if(update && update.message && update.message.photo) {
        return true;
    }
    return false;
}

Handler.prototype.handle = function(update) {

    // to ignore photos that were picked by user using bot's inline function
    // the problem is that "chosen_inline_result" arrives after photo is already posted to chat
    // so we have to wait a little and check :S
    return helper.delayPromise(2100, 2000).then(_ => {

        if(!helper.isResultOfChosenInline(update)) {
            let fileId = update.message.photo.slice(-1).pop().file_id;
            let chatId = update.message.chat.id;
        
            return telegram.getFile(fileId).then(response => {
                if(response.file_path) {
                    let sourceImageUrl = telegram.getFileUrl(response.file_path);
                    imageRenderer.renderOmfgCover(chatId, sourceImageUrl);
                }
            });
        } else {
            return Promise.resolve();
        }
    });
}

module.exports = Handler;
