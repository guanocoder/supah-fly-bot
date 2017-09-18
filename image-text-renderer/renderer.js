var express = require('express')
var router = express.Router();

const jimp = require('jimp');

router.get('/kit/:text', (request, response) => {
    let loadedImage = null;
    jimp.read('./image-text-renderer/kit.jpg')
    .then(image => {
        loadedImage = image;
        return jimp.loadFont('./image-text-renderer/verdana.fnt');        
    })
    .then(font => {
        // write text on the image
        loadedImage.print(font, 150, 82, request.params.text, 148)
        // output image to response
        .getBuffer(jimp.MIME_JPEG, (error, buffer) => {
            response.set("Content-Type", jimp.MIME_JPEG);
            response.send(buffer);
        });
    })
    .catch(error => {
        response.statusCode = 500;
        reponse.send("Error occured in renderer: " + error);
    });    
});

module.exports = router;