var telegram = require("../../api/telegram");

var InlineQueryHandler = function() {};

// ReplyKeyboardMarkup example
InlineQueryHandler.prototype.canHandle = function(update) {
    if(update && update.inline_query) {
        return true;
    }
    return false;
};

InlineQueryHandler.prototype.handle = function(update) {
    return new Promise((resolve, reject) => {
        resolve(
            telegram.answerInlineQuery(update.inline_query.id, 
                JSON.stringify([
                    {
                        type: "sticker",
                        id: String(10000000 + parseInt(Math.random() * 10000000)),
                        sticker_file_id: "CAADAgADqQADWQMDAAE8ExBJs_WvHAI", // заткнись, я воевал!
                    },
                    {
                        type: "sticker",
                        id: String(10000000 + parseInt(Math.random() * 10000000)),
                        sticker_file_id: "CAADAgADtgADNPsXBpaFuBVOTp4lAg" // anime - молчи г*вно
                    },
                    {
                        type: "sticker",
                        id: String(10000000 + parseInt(Math.random() * 10000000)),
                        sticker_file_id: "CAADBAADaQEAAjW7NgABVwW8yS94zhYC" // spongebob - I don't give a funk
                    },
                    {
                        type: "sticker",
                        id: String(10000000 + parseInt(Math.random() * 10000000)),
                        sticker_file_id: "CAADAgADFgEAAsnHuArAgVwG6bz5kwI" // жирик - пшёл вон!
                    },
                    {
                        type: "sticker",
                        id: String(10000000 + parseInt(Math.random() * 10000000)),
                        sticker_file_id: "CAADAgADVAIAAjT7FwZf3h1dJFbWtwI" // anime - завали уже!
                    },
                    {
                        type: "sticker",
                        id: String(10000000 + parseInt(Math.random() * 10000000)),
                        sticker_file_id: "CAADAgADNwMAApkvSwrd8kC724H93QI" // дружко - не могу ответить!
                    },
                    {
                        type: "sticker",
                        id: String(10000000 + parseInt(Math.random() * 10000000)),
                        sticker_file_id: "CAADAgADNgADaJpdDMPkFTIssktrAg" // та замовкнi тi вже!
                    },
                    {
                        // CAADAgADSgEAAjeEMAABYXK6nmHQkkAC
                        type: "sticker",
                        id: String(10000000 + parseInt(Math.random() * 10000000)),
                        sticker_file_id: "CAADAgADSgEAAjeEMAABYXK6nmHQkkAC" // troll.uz - заткниииись!
                    }
                ])
            )
        );
    });
};

module.exports = InlineQueryHandler;
