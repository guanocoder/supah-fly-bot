'use strict';

var requestModule = require('request');
var botToken = process.env.BOT_TOKEN || "AbcEEE";

exports.sendMessage = function(chatId, text, replyToMessageId, replyMarkup) {
    return new Promise((resolve, reject) => {
        requestModule.post({
            url: `https://api.telegram.org/bot${botToken}/sendMessage`,
            form: {
                chat_id : chatId,
                text: text,
                reply_to_message_id: replyToMessageId,
                reply_markup: replyMarkup
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

exports.sendPhoto = function(chatId, photo, options) {
    return new Promise((resolve, reject) => {
        requestModule.post({
            url: `https://api.telegram.org/bot${botToken}/sendPhoto`,
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

exports.getFile = function(fileId) {
    return new Promise((resolve, reject) => {
        requestModule.post({
            url: `https://api.telegram.org/bot${botToken}/getFile`,
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

exports.getFileUrl = function(filePath) {
    return `https://api.telegram.org/file/bot${botToken}/${filePath}`;
}

exports.sendChatAction = function(chatId, action) {
    return new Promise((resolve, reject) => {
        requestModule.post({
            url: `https://api.telegram.org/bot${botToken}/sendChatAction`,
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

exports.answerCallbackQuery = function(callbackQueryId, text, showAlert = false) {
    return new Promise((resolve, reject) => {
        requestModule.post({
            url: `https://api.telegram.org/bot${botToken}/answerCallbackQuery`,
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

exports.answerInlineQuery = function(inlineQueryId, results) {
    return new Promise((resolve, reject) => {
        requestModule.post({
            url: `https://api.telegram.org/bot${botToken}/answerInlineQuery`,
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