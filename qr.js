const qrcode = require("qrcode");
const fs = require('fs');
const Jimp = require('jimp');
const qrCodeReader = require('qrcode-reader');

module.exports = {
    "generateQR": async (text) => {
        try {
            const qr = await qrcode.toDataURL(text, { width: 300, margin: 2 });
            return qr;
        } catch (error) {

        }
    },
    "addPoints": async (id, point) => {
        try {
            // Read the current content of the file
            fs.readFile('./data.json', 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return 'Internal Server Error';
                }
                if(!id){
                    return "id is undefined";
                }
                let parsedData = JSON.parse(data);
                console.log(id);
                let bigTeam = id.split("_")[0];
                let smallTeam = id.split("Team")[1];
                console.log(parsedData);
                parsedData[bigTeam][smallTeam-1].points += point;
                console.log(parsedData);
                fs.writeFile('./data.json', JSON.stringify(parsedData), 'utf8', (err) => {
                    if (err) {
                        console.error(err);
                        return 'Internal Server Error';
                    }

                    // File successfully updated
                    return 'File updated successfully';
                });
            });
        } catch (err) {
            console.error(err);
            return 'Internal Server Error';
        }
    },
    "decodeQR": async (img) => {
        try {
            // Read and process the image data
            const imageBuffer = Buffer.from(img, 'base64');

            // Load the image using Jimp
            const image = await Jimp.read(imageBuffer);

            // Resize the image to a manageable size (optional)
            image.resize(800, 600);

            // Convert the image to a buffer
            const processedImageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

            // Create an instance of the QR code reader
            const qrCode = new qrCodeReader();

            // Decode the QR code from the processed image
            return new Promise((resolve, reject) => {
                qrCode.callback = (error, result) => {
                    if (error) {
                        console.error('Failed to decode QR code:', error);
                        reject('Failed to decode QR code');
                    } else {
                        const qrCodeContent = result.result;
                        console.log('QR code content:', qrCodeContent);
                        resolve('QR code decoded successfully');
                    }
                };

                qrCode.decode(processedImageBuffer);
            });
        } catch (error) {
            console.error('Failed to process image:', error);
            // throw new Error('Failed to process image');
        }
    }
}