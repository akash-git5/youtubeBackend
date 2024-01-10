const mongoose = require("mongoose");
require('dotenv').config();



const dbConnect = async () => {
    await mongoose.connect(process.env.DATABASE_URL)
    .then( () => console.log("DB connection is Successfull !!"))
    .catch( (error) => {
        console.log("DB connection FAILED");
        console.log("ERROR = ",error.message);
        process.exit(1);
    })
}

module.exports = dbConnect;