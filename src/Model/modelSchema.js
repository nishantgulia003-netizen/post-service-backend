const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const modelSchema = mongoose.model("post", postSchema);

module.exports = modelSchema;
