const express = require("express");
const multer = require("multer");
const uploadFile = require("./services/imageKit");
const postModel = require("./Model/modelSchema");
const app = express();
const upload = multer({storage:multer.memoryStorage()})
app.use(express.json());

app.post("/create-post",upload.single("image"),async (req,res)=>{
    try {
        const result = await uploadFile(req.file.buffer);
        console.log("Upload result:", result);

        postModel.create({
            imageUrl:req.url,
            caption: req.body.caption
        })
        


        res.status(200).json({
            message: "Post created successfully",
            imageUrl: result.url,
            caption: req.body.caption
        });
    } catch(error) {
        console.error("Error:", error);
        res.status(500).json({error: "Upload failed"});
    }
});


module.exports = app;