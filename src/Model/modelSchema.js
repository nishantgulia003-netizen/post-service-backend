const mongoose = require("mongoose");

const postSchema =new mongoose.Schema({
    image:"string",
    caption:"string"
})

const modelSchema = mongoose.model("post" ,postSchema);

module.exports = modelSchema