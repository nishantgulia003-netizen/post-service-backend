const mongoose = require("mongoose")

async function connectDb(){
    await mongoose.connect(process.env.MONGO_STRING);

    console.log("Database is connected ");
}
module.exports = connectDb ;