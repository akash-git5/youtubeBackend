const User = require("../models/user.model");
const bcrypt = require("bcrypt")
const uploadToCloudinary = require("../utils/cloudinary")


const registerUser = async (req,res) => {
    try {

        // get all the required fields from req.body
        // check if empty field (validation)
        // check if user already exists or not (validation)
        // hash the password
        // upload avatar to cloudinary
        // create complete user object
        // save the user to DB
        // return res 

        const {username,email,fullName,password} = req.body;

        if(!username || !email || !fullName || !password){
            return res.status(403).json({
                success: false,
                message: "all fields are required"
            })
        }

        const existingUser = await User.findOne({username});

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "user already exist, please log in !"
            })
        }

        const avatarLocalPath = req.files.avatar[0].path;
        const coverLocalPath = req.files.coverImage[0].path;

        if(!avatarLocalPath){
            return res.status(400).json({
                success: false,
                message: "avatar not found !"
            })
        }

        const avatar = await uploadToCloudinary(avatarLocalPath);
        const coverImage = await uploadToCloudinary(coverLocalPath);

        if(!avatar){
            return res.status(400).json({
                success: false,
                message: "avatar url not found from cloudinary !"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);
        
        const user = await User.create({
            username,
            email,
            fullName,
            password: hashedPassword,
            avatar: avatar.url,
            coverImage: coverImage.url || ""
        })

        return res.status(200).json({
            success: true,
            user,
            message: "user is registered successfully !!"
        })

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "user can not be registered ! please try again ."
        })
    }
}

module.exports = registerUser