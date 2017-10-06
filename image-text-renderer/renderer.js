var express = require('express')
var router = express.Router();

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
    }
};

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

// preload images & fonts without doing anything with them
for(let key in router.imageSet) {
    let properties = router.imageSet[key];
    getImage(properties.imageFile);
    getFont(properties.fontFile);
}

function resizeMaintainingAspectRatio(image, targetHeight) {
    let originalWidth = image.bitmap.width;
    let originalHeight = image.bitmap.height;
    let targetWidth = Math.round(originalWidth * (targetHeight / originalHeight));
    image.resize(targetWidth, targetHeight);
}

router.get('/thumb/:image/:text', (request, response) => {
    let imageKey = request.params.image;
    if(imageKey in router.imageSet) {
        renderImageWithText(response, imageKey, request.params.text, true);
    } else {
        response.statusCode = 404;
        response.send("Requested resource not found!");
    }
});

router.get('/:image/:text', (request, response) => {
    let imageKey = request.params.image;
    if(imageKey in router.imageSet) {
        renderImageWithText(response, imageKey, request.params.text, false);
    } else {
        response.statusCode = 404;
        response.send("Requested resource not found!");
    }
});

module.exports = router;