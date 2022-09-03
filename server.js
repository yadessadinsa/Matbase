
/* MATBASE PROGRAMME SERVER EXPRESS + NODEJS + MONGODB
 APP DEPENDENCY
------------------------------------------------------*/
var express = require('express');
var app = express();
var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index.js');
var users = require('./routes/users.js');
var session = require('express-session');
var passport = require('passport');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var passportLocalMongoose = require('passport-local-mongoose');
var multer = require('multer');
var upload = multer({ dest: './uploads' })
var flash = require('connect-flash');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const { createCipheriv } = require('crypto');


// assuming you put views folder in the same directory as app.js
app.set('views', __dirname + '/views')
//app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');

//var MONGODB_URI = https://downloads.mongodb.com/compass/mongosh-1.0.0-win32-x64.zip

const connection = process.env.MONGODB_URI || 'mongodb://localhost/Data_app'
mongoose.connect(connection, function (err) {
    if (err) {
        console.log('Error, connection failed to', connection);
    }
    else {
        console.log('Connection is made to', connection);
    }
});



/*const uri = mongodb+srv://Yadessa:117022@cluster0.q6n7u.mongodb.net/?retryWrites=true&w=majority


     mongoose.connect(uri)({
        useNewUrlParser:true;
        useUnifiedTopology:true;
        useFindAndModify:false;
        useCreateIndex:true
     }).then(()==>{
        console.log('Connection is made to MongoDB');
     }).catch(error)({
        console.error(eror);
     });
        
  */

const PORT = process.env.PORT || 8080

app.use(require('express-session')({
    secret: 'secret',
    saveUninitialized: false,
    resave: false
}));
// app.use(session({ cookieParser:{  maxAge: 60000}})); 

// Passport middleware

app.use(passport.initialize());
app.use(passport.session());
/*app.use(expressValidator({
    errFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formparam = root;

        while (namespace.length) {
            formparam += '[' + namespace.shift()
        }
        return {
            param: formpram,
            msg: msg,
            value: value
        };
    }
}));
*/
app.use(flash());
app.use(function (req, res, next) {
    res.locals.succes_messages = req.flash('succes_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});
app.use('/', routes);
app.use('/users', users);
app.use(users);
app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

app.listen(PORT, function (err) {
    if (err) {
        console.log("The server is not lisenining, Error!!!");
        console.log(err);
    } else
        console.log("The server is runnining successfuly to Port 8080 !!")
})
