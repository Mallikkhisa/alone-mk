const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true
    },
    datePosted:{
        type:Date,
        default:new Date()
    },
    allowed:{
        type:Number,
        default:1
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'users'
    }
});

const BlogPost = mongoose.model('posts',blogPostSchema);

module.exports=BlogPost;