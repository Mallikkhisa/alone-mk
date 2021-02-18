const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://atlas_admin:atlas_admin@cluster0.ej6fx.mongodb.net/test',{
    useNewUrlParser:true,
    useCreateIndex:true, 
    useUnifiedTopology: true
});