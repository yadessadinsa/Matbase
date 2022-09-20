var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;

// var bycript = require('bycriptjs');

/* CONNECTION METHOD TO CONNECT TO THE DATABASE
-----------------------------------------------*/
    var  Instdata = mongoose.connection;
    var Schema = mongoose.Schema;

var engInstShcema = new mongoose.Schema({
    Prname:"string",
    formname: "string",
    date: "string",
    title:"string",
    stationT: "number",
    stationF: "number",
    engname: "string",
    sign: "string",
    instr: "string",
    pass: "number"
    
})

var Instdata = mongoose.model('Instdata', engInstShcema)
module.exports = Instdata;

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
