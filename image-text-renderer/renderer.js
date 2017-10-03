var express = require('express')
var router = express.Router();

const jimp = require('jimp');

router.imageSet = {
    "kit" : {
        imageFile: "kit.jpg",
        mimeType: jimp.MIME_JPEG,
        fontFile: "verdana.fnt",
        textPoint: { x: 150, y: 82 },
        textWidth: 148,
    }
};

function renderImageWithText(response, properties, text, asThumb) {
    let loadedImage = null;
    jimp.read(`./image-text-renderer/${properties.imageFile}`)
    .then(image => {
        loadedImage = image;
        return jimp.loadFont(`./image-text-renderer/${properties.fontFile}`);        
    })
    .then(font => {
        // write text on the image
        loadedImage.print(font, properties.textPoint.x, properties.textPoint.y, text, properties.textWidth);
        if(asThumb) {
            resizeMaintainingAspectRatio(loadedImage, 100);
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

function resizeMaintainingAspectRatio(image, targetHeight) {
    let originalWidth = image.bitmap.width;
    let originalHeight = image.bitmap.height;
    let targetWidth = Math.round(originalWidth * (targetHeight / originalHeight));
    image.resize(targetWidth, targetHeight);
}

router.get('/thumb/:image/:text', (request, response) => {
    let imageKey = request.params.image;
    if(imageKey in router.imageSet) {
        renderImageWithText(response, router.imageSet[imageKey], request.params.text, true);
    } else {
        response.statusCode = 404;
        response.send("Requested resource not found!");
    }
});

router.get('/:image/:text', (request, response) => {
    let imageKey = request.params.image;
    if(imageKey in router.imageSet) {
        renderImageWithText(response, router.imageSet[imageKey], request.params.text, false);
    } else {
        response.statusCode = 404;
        response.send("Requested resource not found!");
    }
});

module.exports = router;