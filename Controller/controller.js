const User = require('../db/models/user')
const BlogPost = require('../db/models/blogpost');
const path = require('path');
const bcrypt = require('bcrypt');
const controller={
    homePageController:async(req,res)=>{
        const posts = await BlogPost.find({allowed:1}).populate('owner');
        //console.log(req.session); 
        const blogposts = posts.reverse();
        res.render('index',{
            blogposts
        });
        //console.log(blogposts);
    },
    newPostController:(req,res)=>{
        if(req.session.userId){
           return res.render('create');
        }
        res.redirect('/user/login');
    },

    aboutController:(req,res)=>{
        res.render('about');
    },
    
    //Saving Posts
    storePostsController : async(req,res)=>{
        try{ 
                const blogpost = {...req.body,owner:req.session.userId};
                const post = new BlogPost(blogpost);
                await post.save();
                res.redirect('/');
        }catch(e){
            res.status(400).send({error:'Server error'});
        }
    },

    selectPostController:async(req,res)=>{
        try{
            const blogpost = await BlogPost.findById(req.params.id).populate('owner');
            
            res.render('post',{
                blogpost,
            });
        }catch(e){
            res.status(400).send(e);
        } 
    },
    // It renders the signup page 
    signupPageController:async(req,res)=>{
        res.render('register');
    },
    // stores new user in the database
    signupUserController:async(req,res)=>{
        try{
            const user = new User(req.body);
            await user.save();
            req.session.userId = user._id;
            //req.header('Authorization') = token;
            //console.log(req.header('Authorization'));
            res.redirect('/');
        }catch(e){
            res.send(e);
        }
    },
    loginPageController:(req,res)=>{
        res.render('login');
    },
    loginUserController:async(req,res)=>{
        try{
           const user = await User.findOne({email:req.body.email});
            if(!user){
                res.redirect('/user/login');
            }
            else{
            const isMatch = await bcrypt.compare(req.body.password,user.password);
            if(!isMatch){
                res.redirect('/user/login');
            }else{
                // Store the session token
                req.session.userId = user._id;
                res.redirect('/');
            }
        }
        }catch(e){
            res.send(e);
        }
    
    },
    logoutUserController:(req,res)=>{
        req.session.destroy(()=>{
            res.redirect('/');
        })
    },

    deletePostController: async(req,res)=>{
        try{
            const post = await BlogPost.findById(req.params.id);
            console.log(typeof(post.owner));
            console.log(typeof(req.session.userId));
            if(post.owner.toString() === req.session.userId){
            console.log('Should be deleted');
            post.allowed = 0;
            await post.save();
            res.redirect('/');
            }
            else{
                res.redirect('/');  
            }
        }catch(e){

        }
    }

}

module.exports = controller;