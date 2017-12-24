var database = require("../../api/database");

// This array shall hold last chosen file_ids. All in order for bot to tell the difference
// between media sent via this same bot's @inline functionality or some unrelated content
var chosenItemTracker = null;
var Handler = function(sharedTracker) { // constructor
    chosenItemTracker = sharedTracker;
};

Handler.prototype.canHandle = function(update) {
    if(update.chosen_inline_result) {
        return true;
    }
    return false;
}

Handler.prototype.handle = function(update) {
    let fileId = update.chosen_inline_result.result_id;
    chosenItemTracker[update.chosen_inline_result.from.id] = fileId;
    return database.registerHit(fileId);
}

module.exports = Handler;
