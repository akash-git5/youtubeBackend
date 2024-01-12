import {v2 as cloudinary} from 'cloudinary';
const fs = require('fs');

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});



const uploadToCloudinary = async (localFilePath) => {

    try {
        if(!localFilePath){
            console.log("localFilePath does not found !!");
            return null
        }
    
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        
        console.log("file uploaded to cloudinary successfully - ", response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}


module.exports = uploadToCloudinary
