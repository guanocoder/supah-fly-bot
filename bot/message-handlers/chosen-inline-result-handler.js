var database = require("../../api/database");
var helper = require("./helper");

var Handler = function() {};

Handler.prototype.canHandle = function(update) {
    if(update.chosen_inline_result) {
        return true;
    }
    return false;
}

Handler.prototype.handle = function(update) {
    let fileId = update.chosen_inline_result.result_id;
    helper.registerChosenInlineResult(update.chosen_inline_result.from.id, fileId);
    return database.registerHit(fileId);
}

module.exports = Handler;
