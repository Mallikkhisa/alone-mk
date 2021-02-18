const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const auth = require('./middleware/auth');
const ifLoggedin = require('./middleware/ifLoggedin');
require('./db/mongoose');
const BlogPost = require('./db/models/blogpost');
const controller = require('./Controller/controller')
const app = new express();

const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

app.use(session({
    secret:'SecretCode',
    resave: true,
    saveUninitialized: true 
}));

global.loggedin = null;
app.use("*",(req,res,next)=>{
    loggedin = req.session.userId;
    next(); 
})
const ejs = require('ejs');

app.set('view engine','ejs');

const validation = (req,res,next)=>{
    if(req.body.title === null || req.body.body === null){
        return res.redirect('/post/new');
    }
    next();
}

//app.use(validation);
//console.log(path.join(__dirname,'/public'));
app.get('/',controller.homePageController);

app.get('/about',controller.aboutController);

app.get('/posts/new',auth,controller.newPostController); 

// '/post/store' stores the form data to the database
app.post('/post/store',auth,controller.storePostsController);

app.get('/post/:id',auth,controller.selectPostController);

app.get('/user/signup',ifLoggedin,controller.signupPageController);

app.post('/users/register',ifLoggedin,controller.signupUserController);

app.get('/user/login',ifLoggedin,controller.loginPageController);

app.post('/user/login',ifLoggedin,controller.loginUserController); 

app.get('/user/logout',controller.logoutUserController);

app.post('/delete/post/:id',auth,controller.deletePostController);

app.listen(port,()=>{
    console.log('App is up at port '+port);  
});

// const bcrypt = require('bcrypt');
// const myFunction=async()=>{
// const password = 'password';
// const newPass = await bcrypt.hash(password,9);
// console.log(newPass);
// const isMatch = await bcrypt.compare(password,newPass);
// console.log(isMatch);
// }

// myFunction();