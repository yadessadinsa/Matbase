
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;

// var bycript = require('bycriptjs');

/* CONNECTION METHOD TO CONNECT TO THE DATABASE
-----------------------------------------------*/
    var  data = mongoose.connection;
    var Schema = mongoose.Schema;
    
var dataSchema = new mongoose.Schema({
    TotExc: "number",
    stationF: "string",
    stationT: "string",
    filltype: "string",
    layerno: "number",
    thickness: "number",
    Quantity: "number",
    approval: "string",
    supervisor: "string",
    Date: "string",
    comment: "string",
    picture: "string",
    profile: "string",
    layerIm: "string",
    Evolume: "number",
    shrnk: "number",
    BPname: "string",
    MatCol: "string",
    MatLyr: "string",
    RemQnt: "number",
    PrjNm: "string"
})



var data = mongoose.model('data', dataSchema)
module.exports = data;

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

