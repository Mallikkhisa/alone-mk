const User = require('../db/models/user');

const auth = async(req,res,next)=>{
    const user = await User.findById(req.session.userId);
    if(!user){
       return res.redirect('/');
    }
    next(); 
}

module.exports = auth;