var database = require("../../api/database");

var HitHandler = function() {};

HitHandler.prototype.canHandle = function(update) {
    if(update && update.message && 
        update.message.document || update.message.sticker || update.message.photo) {
        return true;
    }
    return false;
}

HitHandler.prototype.handle = function(update) {
    let fileId = null;
    if(update.message.document)
        fileId = update.message.document.file_id;
    else if(update.message.sticker)
        fileId = update.message.sticker.file_id;
    else if(update.message.photo && update.message.photo.length > 0)
        fileId = update.message.photo[update.message.photo.length - 1].file_id;
    else
        return Promise.reject("Error: Cannot retrieve file_id from received photo, sticker or gif!");
    return database.registerHit(fileId);
}

module.exports = HitHandler;
