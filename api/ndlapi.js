const requestModule = require('request');
const telegram = require('./telegram');

const nldApiUrl = "https://backend.demo.neurodatalab.dev:8085";
const REQUEST_TIMEOUT = 3000;

function generate(template) {
    function getRandomCharCode() {
        // 26 lowercase letters start from charcode:97
        // 10 numbers start from charcode:48
        // 36 valid characters in total
        let randomCode = Math.random()*36|0;
        return (randomCode < 10) ? 48 + randomCode : 87 + randomCode;  
    }
    return template.replace(/[\#]/g, c => String.fromCharCode(getRandomCharCode()));
}

function postToSlushBackEnd(url, imageAsBase64String, token) {
    return new Promise((resolve, reject) => {
        const request = requestModule.post(url + "/" + token, {
            timeout: REQUEST_TIMEOUT,
            rejectUnauthorized: false,
        }).on('close', _ => {
            resolve(token);
        }).on('error', error => {
            reject(error);
        });
        const form = request.form();
        form.append('image', "data:image/jpeg;base64," + imageAsBase64String);
    });
}

function getResult(url, token) {
    return new Promise((resolve, reject) => {
        requestModule.get(`${url}/${token}`, {
            timeout: REQUEST_TIMEOUT,
            rejectUnauthorized: false,
        }, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(body).faces);
            }
        }).end();
    })
}

async function postToNdlUntilSuccess(base64, url, token) {
    let result = null;
    const MAX_RETRIES = 5;
    let retries = 0;
    const DELAY_MILIS = 300;

    while ((result == null || result.length == 0) && retries < MAX_RETRIES) {
        retries++;
        await delay(DELAY_MILIS);
        await postToSlushBackEnd(url, base64, token);
        await delay(DELAY_MILIS);
        result = await getResult(url, token);
    }
    return result;
}

function detectEmotions(telegramFileId) {
    var ndlApiToken = generate("#####################");

    return getResult(nldApiUrl, ndlApiToken).then(result => {
        // this should initialize session, no results are expected
        return result;
    }).then(_ => {
        return telegram.downloadFileAsBase64(telegramFileId);
    }).then(base64string => {
        return postToNdlUntilSuccess(base64string, nldApiUrl, ndlApiToken);
    }).then(result => {
        if (result && result.length > 0) {
            return result.map(face => {
                const emotions = {};
                face.emotions.forEach(emotion => emotions[emotion[0]] = Number(emotion[1]) * 100);
                return {
                    ...face,
                    emotions 
                };
            });
        } else {
            throw new Error("Empty result!");
        }
    });
}

module.exports = {
    detectEmotions,
}
