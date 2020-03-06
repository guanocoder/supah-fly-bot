'use strict';

var requestModule = require('request');
var botToken = process.env.BOT_TOKEN || "AbcEEE";

const TELEGRAM_HOST = "api.telegram.org";

function sendMessage(chatId, text, replyToMessageId, replyMarkup, parse_mode) {
    return new Promise((resolve, reject) => {
        requestModule.post({
            url: `https://${TELEGRAM_HOST}/bot${botToken}/sendMessage`,
            form: {
                chat_id : chatId,
                text: text,
                parse_mode: parse_mode,
                reply_to_message_id: replyToMessageId,
                reply_markup: replyMarkup
            }
        }, (error, response, body) => {
            if(error) {
                console.log("Telegram sendMessage() error: " + JSON.stringify(error));
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

function sendPhoto(chatId, photo, options) {
    return new Promise((resolve, reject) => {
        requestModule.post({
            url: `https://${TELEGRAM_HOST}/bot${botToken}/sendPhoto`,
            formData: {
                chat_id: chatId,
                photo: {
                    value: photo,
                    options: options
                }
            }
        }, (error, response, body) => {
            if(error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}

function sendDocument(chatId, document, options) {
    return new Promise((resolve, reject) => {
        requestModule.post({
            url: `https://${TELEGRAM_HOST}/bot${botToken}/sendDocument`,
            formData: {
                chat_id: chatId,
                document: {
                    value: document,
                    options: options
                }
            }
        }, (error, response, body) => {
            if(error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}

function sendSticker(chatId, sticker, options) {
    return new Promise((resolve, reject) => {
        requestModule.post({
            url: `https://${TELEGRAM_HOST}/bot${botToken}/sendSticker`,
            formData: {
                chat_id: chatId,
                sticker: {
                    value: sticker,
                    options: options
                }
            }
        }, (error, response, body) => {
            if(error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}

function getFile(fileId) {
    return new Promise((resolve, reject) => {
        requestModule.post({
            url: `https://${TELEGRAM_HOST}/bot${botToken}/getFile`,
            form: {
                file_id: fileId,
            }
        }, (error, response, body) => {
            if(error) {
                reject(error);
            } else {
                if(response.statusCode == 200) {
                    let body = JSON.parse(response.body);
                    if(body.ok) {
                        resolve(body.result);
                    } else {
                        reject("Error: Telegram responded with body.ok = " + body.ok + ": " + JSON.stringify(response));
                    }
                } else {
                    reject("Error: Telegram responded with statusCode " + response.statusCode + ": " + JSON.stringify(response));
                }
            }
        });
    });
}

function getFileUrl(filePath) {
    return `https://${TELEGRAM_HOST}/file/bot${botToken}/${filePath}`;
}

function sendChatAction(chatId, action) {
    return new Promise((resolve, reject) => {
        requestModule.post({
            url: `https://${TELEGRAM_HOST}/bot${botToken}/sendChatAction`,
            form: {
                chat_id : chatId,
                action: action
            }
        }, (error, response, body) => {
            if(error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

function answerCallbackQuery(callbackQueryId, text, showAlert = false) {
    return new Promise((resolve, reject) => {
        requestModule.post({
            url: `https://${TELEGRAM_HOST}/bot${botToken}/answerCallbackQuery`,
            form: {
                callback_query_id : callbackQueryId,
                text: text,
                show_alert: showAlert
            }
        }, (error, response, body) => {
            if(error) {
                reject(error);
            } else {
                resolve(response);
            }     
        });
    });
};

function answerInlineQuery(inlineQueryId, results) {
    return new Promise((resolve, reject) => {
        requestModule.post({
            url: `https://${TELEGRAM_HOST}/bot${botToken}/answerInlineQuery`,
            form: {
                inline_query_id : inlineQueryId,
                results: results
            }
        }, (error, response, body) => {
            if(error) {
                reject(error);
            } else {
                resolve(response);
            }     
        });
    });
};

function downloadFileAsBase64(fileId) {
    return getFile(fileId).then(file => {
        return downloadFileByPathAsBase64(file.file_path);
    });
}

function downloadFileByPathAsBase64(filePath) {
    return new Promise((resolve, reject) => {
        const options = {
            host: TELEGRAM_HOST,
            path: `/file/bot${botToken}/${filePath}`,
            timeout: 3000
        }
        const request = https.request(options, function(response) {  
            var data = new require('stream').Transform();                                                            
            response.on('data', function(chunk) {                                       
                data.push(chunk);                                                    
            });                                                                         
            response.on('end', function() {                                             
                resolve(Buffer.from(data.read()).toString('base64'));
            });
        }).on('error', error => {
            reject(error);
        }).on('timeout', _ => {
            request.abort();
        }).end();
    });
}

module.exports = {
    sendMessage,
    sendPhoto,
    sendDocument,
    sendSticker,
    getFile,
    getFileUrl,
    sendChatAction,
    answerCallbackQuery,
    answerInlineQuery,
    downloadFileAsBase64,
};