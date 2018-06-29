var express = require('express')
var router = express.Router();

var telegram = require("../api/telegram");

const jimp = require('jimp');

const imageCache = {};
const fontCache = {};

router.imageSet = {
    "kit" : {
        imageFile: "kit.jpg",
        imageHeight: 308,
        imageWidth: 308,
        mimeType: jimp.MIME_JPEG,
        fontFile: "verdana.fnt",
        textPoint: { x: 150, y: 82 },
        textWidth: 148,
    },
    "idea" : {
        imageFile: "idea.jpg",
        imageHeight: 447,
        imageWidth: 447,
        mimeType: jimp.MIME_JPEG,
        fontFile: "arial_white.fnt",
        textPoint: { x: 260, y: 90 },
        textWidth: 180,
    },
    "whonniepooh" : { // Вонипух
        imageFile: "whonniepooh.jpg",
        imageHeight: 339,
        imageWidth: 306,
        mimeType: jimp.MIME_JPEG,
        fontFile: "verdana.fnt",
        textPoint: { x: 60, y: 20 },
        textWidth: 186,        
    },
    "boozer" : {
        imageFile: "boozer.jpg",
        imageHeight: 432,
        imageWidth: 378,
        mimeType: jimp.MIME_JPEG,
        fontFile: "arial_white.fnt",
        textPoint: { x: 20, y: 20 },
        textWidth: 338,        
    },
    "disgusting-pooh" : {
        imageFile: "disgusting-pooh.jpg",
        imageHeight: 404,
        imageWidth: 400,
        mimeType: jimp.MIME_JPEG,
        fontFile: "verdana.fnt",
        textPoint: { x: 20, y: 20 },
        textWidth: 360,        
    }
};

router.renderOmfgCover = function(chatId, sourceImageUrl) {
    jimp.read(`./image-text-renderer/cannotunsee.jpg`).then(targetImage => {
        return jimp.read(sourceImageUrl).then(sourceImage => {
            sourceImage.scaleToFit(150, 162, jimp.AUTO);
            let xtraSpaceOnY = (162 - sourceImage.bitmap.height) / 2; 
            // draw source image inside Omfg jpeg frame
            targetImage.composite(sourceImage, 150, xtraSpaceOnY);
            targetImage.getBuffer(jimp.MIME_JPEG, (error, buffer) => {
                // send via telegram as buffer, with options for the photo field in multipart-form 
                // specifying file options is necessary otherwise telegram will give '413 Payload Too Large' error
                telegram.sendPhoto(chatId, buffer, { filename: "cannotunsee.jpg", contentType: jimp.MIME_JPEG }).then(result => {
                    //console.log("sent photo via telgram: statusCode=" + result.statusCode);
                }).catch(error => {
                    console.log("Error sending telegram photo: " + error);
                })
            })
        });
    }).catch(error => {
        console.log("Error while rendering OMFG cover: " + error);
    });
}

function stonedTalk(message) {
    let vowels = "eyuioa" + "ёуеаоэяию";
    message = message.toLowerCase();
    if(message && message.length > 0) {
        return message.split(' ').map(value => {
            // remove non-word characters
            value = value.replace(/[^a-z|^а-я|^ё]/gu, '')  
            if(value.length > 3) {
                // remove all vowels in the middle
                let skipped = 0;
                return value.split('').reduce((accumulator, currentValue, index, originalArray) => {
                    if(index !== 0 && index+1 !== originalArray.length) {
                        if(vowels.indexOf(currentValue) > -1) {
                            if((++skipped) + 2 < originalArray.length) {
                                return accumulator; // skip vowel
                            }
                        }
                    }
                    return accumulator += currentValue;
                }, '');

            } else {
                return value;
            }
        }).join(' ');
    }
    return message;
}

function renderImageWithText(response, imageKey, text, asThumb) {
    let properties = router.imageSet[imageKey];
    let loadedImage = null;
    getImage(properties.imageFile).then(image => {
        loadedImage = image;
        return getFont(properties.fontFile);        
    })
    .then(font => {
        // write text on the image
        loadedImage.print(font, properties.textPoint.x, properties.textPoint.y, text, properties.textWidth);
        if(asThumb) {
            resizeMaintainingAspectRatio(loadedImage, 300);
        }
        // output image to response
        loadedImage.getBuffer(properties.mimeType, (error, buffer) => {
            response.set("Content-Type", properties.mimeType);
            response.send(buffer);
        });
    })
    .catch(error => {
        response.statusCode = 500;
        response.send("Error occured in renderer: " + error);
    });        
}

function getImage(fileName) {
    return new Promise((resolve, reject) => {
        if(imageCache[fileName]) {
            resolve(imageCache[fileName].clone());
        } else {
            // Load image
            console.log("Image loaded from file: " + fileName);
            jimp.read(`./image-text-renderer/${fileName}`).then(image => {
                imageCache[fileName] = image;
                resolve(image.clone());
            }).catch(reject);
        }
    });
}

function getFont(fileName) {
    return new Promise((resolve, reject) => {
        if(fontCache[fileName]) {
            resolve(fontCache[fileName]);
        } else {
            // Load font
            console.log("Font loaded from file: " + fileName);
            jimp.loadFont(`./image-text-renderer/${fileName}`).then(font => {
                fontCache[fileName] = font;
                resolve(font);
            }).catch(reject);
        }
    });
}

function resizeMaintainingAspectRatio(image, targetHeight) {
    let originalWidth = image.bitmap.width;
    let originalHeight = image.bitmap.height;
    let targetWidth = Math.round(originalWidth * (targetHeight / originalHeight));
    image.resize(targetWidth, targetHeight);
}

// preload images & fonts without doing anything with them
router.preload = function() {
    for(let key in router.imageSet) {
        let properties = router.imageSet[key];
        getImage(properties.imageFile);
        getFont(properties.fontFile);
    }
}

router.get('/thumb/:image', (request, response) => {
    let imageKey = request.params.image;
    if(imageKey in router.imageSet) {
        let text = (imageKey == 'whonniepooh') ? stonedTalk(request.query.text) : request.query.text;
        renderImageWithText(response, imageKey, text, true);
    } else {
        response.statusCode = 404;
        response.send("Requested resource not found!");
    }
});

router.get('/:image', (request, response) => {
    let imageKey = request.params.image;
    if(imageKey in router.imageSet) {
        let text = (imageKey == 'whonniepooh') ? stonedTalk(request.query.text) : request.query.text;
        renderImageWithText(response, imageKey, text, false);
    } else {
        response.statusCode = 404;
        response.send("Requested resource not found!");
    }
});

module.exports = router;
