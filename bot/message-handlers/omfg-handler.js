var telegram = require("../../api/telegram");

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
    let fileId = update.message.photo.slice(-1).pop().file_id;
    let chatId = update.message.chat.id;

    return telegram.getFile(fileId).then(response => {
        if(response.file_path) {
            let sourceImageUrl = telegram.getFileUrl(response.file_path);
            renderer.renderOmfgCover(chatId, sourceImageUrl);
        }
    });
}

module.exports = Handler;
