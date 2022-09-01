
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var data = require('../models/data.js');
const { cache } = require('ejs');

// var bycript = require('bycriptjs');

/* Statistical analysis of the mongoose data fields.
-----------------------------------------------*/


exports.getdataStatus = async (req, res) => {
  try{

     const stats = await data.aggregate(
      [
        {
          '$match': {}
        }, {
          '$group': {
            '_id': '$filltype', 
            'Sum': {
              '$sum': '$Quantity'
            }
          }
        }
      ]
     );
     res.status(200).json({
      status: 'Success',
      data:{
        stats
      }
    }); 
     
   
   } catch (err) {
      res.staus(400).json({
        status: 'fail',
        message: err
      });
    }  
  }





 