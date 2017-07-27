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
}