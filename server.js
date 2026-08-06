require("dotenv").config();

const app = require("./src/app");
const connectDb = require("./src/Db/Db");
const modelSchema = require("./src/Model/modelSchema");
const uploadFile = require("./src/services/imageKit");


async function connectServer() {
        await connectDb();
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        }); 
}

connectServer();