require("dotenv").config();
const express = require("express");
const app = express();
const dbConnect = require("./db/dataBase");
const cors = require("cors");
const cookieParser = require("cookie-parser");


// Configuration of the Express App :
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cookieParser());



// importing routes :
const userRoutes = require("./routes/user.routes")



// defining routers :
app.use("/api/v1/user",userRoutes);




dbConnect();

app.listen(process.env.PORT, () => {
    console.log(`⚙️ Server is running on PORT: ${process.env.PORT}`);
})

// app.get("/", (req,res) => {
//     res.send(`<h3>Believe in yourself And NEVER GIVE UP !</h3>`);
// })
