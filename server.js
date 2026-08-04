require("dotenv").config();

const app = require("./src/app");
const connectDb = require("./src/Db/Db");
const modelSchema = require("./src/Model/modelSchema");
const uploadFile = require("./src/services/imageKit");

connectDb();

async function connectServer(){

    app.listen(3000,()=>{
        console.log("server is running on port 3000");
    })
}

connectServer();