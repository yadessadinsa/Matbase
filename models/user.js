var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;

// var bycript = require('bycriptjs');

/* CONNECTION METHOD TO CONNECT TO THE DATABASE
-----------------------------------------------*/
    var  User = mongoose.connection;
    var Schema = mongoose.Schema;
    
var UserSchema = new mongoose.Schema({
    username: "string",
    password: "string",
    email: "string",
    name: "string",
    profileimage: "string",
    Prname: "string"
});
UserSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', UserSchema);
module.exports = User;

getUserById = function(id, callback){
    User.findById(id, callback);
}

getUserByUsername =function(username,callback){
    var query = {username:username};
    User.findOne(query, callback);
}

comparePassword = function(candidatePassword, hash, callback){
    bycript.compare(candidatePassword, hash, function(err, isMatch){
        callback(null, ismatch);
    })
}

 
// module.exports.getUserById = function(id, callback){
    // User.findById(id, callback);
// }

// module.exports.getUserByUsername =function(username,callback){
    // var query = {username:username};
    // User.findOne(query, callback);
// }

// module.exports.comparePassword = function(candidatePassword, hash, callback){
    // bycript.compare(candidatePassword, hash, function(err, isMatch){
        // callback(null, ismatch);
    // })
// }
// module.exports.createUser = function(newUser, callback){
//         bycript.genSalt(10, function(err, salt){
//             bycript.hash(newUser.password , salt, function(err, hash){
//                 newUser.password = hash;
//                 newUser.save(callback);
//             });
//         });
//    }
