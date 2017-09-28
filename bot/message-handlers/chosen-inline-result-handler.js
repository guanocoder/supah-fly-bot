var database = require("../../api/database");

var Handler = function() {};

Handler.prototype.canHandle = function(update) {
    if(update && update.chosen_inline_result) {
        return true;
    }
    return false;
}

Handler.prototype.handle = function(update) {
    let fileId = update.chosen_inline_result.result_id;
    return database.registerHit(fileId);
}

module.exports = Handler;
