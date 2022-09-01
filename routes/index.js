var express = require('express');
var router = express.Router();


/* GET HOME PAGE
--------------------------------------*/


router.get('/', function (req, res, next) {
    res.render('home0')
})

function ensureAuthenticated(req , res, next){
    if(req.isAuthenticated()){
       return next();
    }else{
    res.redirect('/users/login');

    }
}    
 module.exports = router;
