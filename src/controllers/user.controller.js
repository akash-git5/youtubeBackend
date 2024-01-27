const User = require("../models/user.model");
const bcrypt = require("bcrypt")
const uploadToCloudinary = require("../utils/cloudinary")
const fs = require("fs")
const jwt = require("jsonwebtoken");
// const { options } = require("../routes/user.routes");


exports.registerUser = async (req,res) => {
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

        const avatarLocalPath = req.files.avatar[0].path;
        const coverImageLocalPath = req.files.coverImage ? req.files.coverImage[0].path : "";

        if(existingUser){
            fs.unlinkSync(avatarLocalPath); // <MY CONTRIBUTION>
            coverImageLocalPath ? fs.unlinkSync(coverImageLocalPath) : ""; // <MY CONTRIBUTION>
            return res.status(400).json({
                success: false,
                message: "user already exist, please log in !"
            })
        }

        // const avatarLocalPath = req.files.avatar[0].path;
        // const coverImageLocalPath = req.files.coverImage ? req.files.coverImage[0].path : "";

        if(!avatarLocalPath){
            return res.status(400).json({
                success: false,
                message: "avatar not found !"
            })
        }

        const avatar = await uploadToCloudinary(avatarLocalPath);
        const coverImage = await uploadToCloudinary(coverImageLocalPath);

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
            coverImage: coverImage?.url || ""
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


exports.loginUser = async (req,res) =>{
    try {

        // extract all data from -> req.body
        // check if not empty
        // check user is exist or not
        // check for correct password
        // create jwt token 
        // add/insert that token in user DB and save it 
        // send that token in cookies
        // return res

        const {username,email,password} = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required !"
            })
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success: false,
                message: "user is not registered !, 1st sign up"
            })
        }

        const payload = {
            email: user.email,
            username: user.username,
            _id: user._id
        }

        if( await bcrypt.compare(password,user.password) ){

            const token = jwt.sign(payload,process.env.JWT_SECRET,
                {
                    expiresIn: "2h"
                });

            user.token = token;
            await user.save();
            // const existingUser = await User.find({email});

            const options = {
                httpOnly: true,
                expires: new Date(Date.now()+ 3*24*60*60*1000)
            }

            res.status(200).cookie("token",token,options).json({
                success: true,
                token,
                user,
                // existingUser,
                message: "User logged in successfully !"
            })
            

        } else {

            return res.status(400).json({
                success: false,
                message: "password is incorrect !"
            })

        }

        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "user can't be logged in, something went wrong !"
        })
    }
}

exports.logoutUser = async (req,res) =>{
    try {
        
        // find the user and update the token:
        // console.log("hi = ", req.user._id);
        const user = await User.findByIdAndUpdate(req.user._id,
            {
                $set:{
                    token: undefined
                }
            },
            {
                new: true
            }
            );
        console.log("user => ", user);

        const options = {
            httpOnly: true,
            expires: new Date(Date.now()+ 3*24*60*60*1000)
        }

        return res.status(200).clearCookie("token",options).json({
            success: true,
            message: "user logged out",
            user
        })
        
            

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "user can't be logged out !"
        })
    }
}

exports.changeUserPassword = async (req,res) => {
    try {
        
        const {oldPassword,newPassword} = req.body;

        if(!oldPassword || !newPassword){
            return res.status(400).json({
                success: false,
                message: "all fields are required !"
            })
        }

        const user = await User.findById(req.user._id);

        if( await bcrypt.compare(oldPassword,user.password) ){
            
            const hashedPassword = await bcrypt.hash(newPassword,10);

            user.password = hashedPassword
            await user.save();

            return res.status(200).json({
                success: true,
                message: "password changes successfully !"
            })

        } else {
            return res.status(400).json({
                success: false,
                message: "oldPassword doesn't match !"
            })
        }

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Password changes failed !'
        })
    }
}

exports.updateUserAvatar = async (req,res) => {
    try {
        
        const avatarLocalPath = req.files.avatar[0].path;
        if(!avatarLocalPath){
            return res.status(400).json({
                success: false,
                message: "avatar not found !"
            })
        }

        const avatarClodinary = await uploadToCloudinary(avatarLocalPath);
        if(!avatarClodinary){
            return res.status(500).json({
                success: false,
                message: "something went wrong, avatar cloudinary path not found !"
            })
        }


        const user = await User.findByIdAndUpdate(req.user._id,
            {
                $set:{
                    avatar: avatarClodinary.url
                }
            },
            {
                new: true
            })

        return res.status(200).json({
            success: true,
            message: "avatar updated successfully !",
            user
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "avatar updation failed !"
        })
    }
}




// exports.getCurrentUser = async (req,res) => {
//     try {

//         const user = await User.findById(req.user._id);

//         if(!user){
//             return res.status(400).json({
//                 success: false,
//                 message: "user doesn't found !"
//             })
//         }

//         return res.status(200).json({
//             success: true,
//             user,
//             message: "current user fetched successfully !"
//         })
        
//     } catch (error) {
//         return res.status(200).json({
//             success: false,
//             message: 'current user fetch failed !'
//         })
//     }
// }





// module.exports = registerUser