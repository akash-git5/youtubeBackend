const { default: mongoose } = require("mongoose");

const videoSchema = new mongoose.Schema({
    videoFile: {            // url ayega cloudinary se
        type: String,
        required: true
    },
    thumbnail : {           // url ayega cloudinary se
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },

},{timestamps:true});


module.exports = mongoose.model("Video",videoSchema);