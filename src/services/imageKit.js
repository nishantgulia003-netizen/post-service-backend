const Imagekit = require("imagekit")

const imageKit = new Imagekit({
    privateKey: process.env.private_key,
    publicKey: process.env.public_key,
    urlEndpoint: process.env.url_Endpoint
})

async function uploadFile(buffer){
    const result = await imageKit.upload({
        file: buffer.toString("base64"),
        fileName: "image.png"
    });
    return result;
}

module.exports = uploadFile;