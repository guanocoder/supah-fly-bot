// This array is global, like a static variable, to all code that require()s it.
// It shall hold last chosen file_ids. All in order for bot to tell the difference
// between media sent via this same bot's @inline functionality or some unrelated content
var chosenItemTracker = [];

// and static utility methods
module.exports = {
    delayPromise: function(maximumDelayMiliseconds, minimumDelayMiliseconds) {
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
    },
    registerChosenInlineResult: function(userId, fileId) {
        chosenItemTracker[userId] = fileId;
    },
    isResultOfChosenInline: function(update) {
        if(update.message && update.message.chat.type != "private") {
            if (update.message.sticker || update.message.photo || update.message.document) {
                let message = update.message;
                let fileId = chosenItemTracker[message.from.id];
                if(fileId) {
                    if(message.sticker) {
                        return fileId == message.sticker.file_id;
                    } else if (message.document) {
                        return fileId == message.document.file_id;
                    } else if (message.photo) {
                        return (message.photo.find(item => item.file_id == fileId)) ? true : false;
                    }
                }
            }
        }
        return false;
    }
};