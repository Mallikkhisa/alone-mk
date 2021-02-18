const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    
    
});


userSchema.pre('save',async function(next){
    const user = this;
    if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password,9);
    }
    next();
})

const User = mongoose.model('users',userSchema);

module.exports = User;