const jwt = require("jsonwebtoken")
const User = require("../models/user.model")


const auth = async (req,res,next) => {
    try {
        const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "");

        if(!token){
            return res.status(400).json({
                success: false,
                message: "token not found !"
            })
        }

        const decodeToken = jwt.verify(token,process.env.JWT_SECRET);

        // console.log("decoded = > ",decodeToken);

        const user = await User.findById(decodeToken._id);

        if(!user){
            return res.status(400).json({
                success: false,
                message: "invalid token !"
            })
        }

        req.user = decodeToken;
        next();

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "authorization failed !"
        })
    }
}

module.exports = auth;