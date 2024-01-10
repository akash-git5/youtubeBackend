const express = require("express");
const app = express();
const dbConnect = require("./db/dataBase");
require("dotenv").config();


dbConnect();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
})

// app.get("/", (req,res) => {
//     res.send(`<h3>Believe in yourself And NEVER GIVE UP !</h3>`);
// })
