const express = require("express");
const router = express.Router();
const {registerUser,loginUser} = require("../controllers/user.controller");
const upload = require("../middlewares/multer.middleware");


router.post("/register",upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]) ,registerUser);

router.get("/login",loginUser);



module.exports = router;