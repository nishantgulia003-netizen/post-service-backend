const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    imageUrl: {
        type: String
    },
    caption: {
        type: String
    }
}, { timestamps: true });

const modelSchema = mongoose.model("post", postSchema);

module.exports = modelSchema;
