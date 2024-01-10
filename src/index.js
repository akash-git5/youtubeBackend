const express = require("express");
const app = express();
const dbConnect = require("./db/dataBase");
require("dotenv").config();


dbConnect();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
})
