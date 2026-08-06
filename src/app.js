const express = require("express");
const multer = require("multer");
const uploadFile = require("./services/imageKit");
const postModel = require("./Model/modelSchema");
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
app.use(express.json());
app.post("/create-post", upload.single("image"), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "An image file is required in the 'image' field." });
        }

        if (!req.file.mimetype.startsWith("image/")) {
            return res.status(400).json({ error: "The uploaded file must be an image." });
        }

        const result = await uploadFile(req.file.buffer);

        const post = await postModel.create({
            imageUrl: result.url,
            caption: req.body.caption
        });

        return res.status(201).json({
            message: "Post created successfully",
            post
        });
    } catch (error) {
        next(error);
    }
});

app.get("/get-posts", async (req,res)=>{

    const posts = await postModel.find();

    res.status(200).json({
        message: "Posts fetching successfully",
        posts
    })

})

module.exports = app;
