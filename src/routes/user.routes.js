const express = require("express");
const router = express.Router();
const {registerUser,loginUser,logoutUser,changeUserPassword,getCurrentUser,updateUserAvatar} = require("../controllers/user.controller");
const upload = require("../middlewares/multer.middleware");
const auth = require("../middlewares/auth.middleware")


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
router.get("/logout",auth, logoutUser);
router.post("/changePassword",auth, changeUserPassword);
// router.get("/getCurrentUser", auth, getCurrentUser);
router.patch("/updateAvatar",auth, upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }
]), updateUserAvatar)



module.exports = router;