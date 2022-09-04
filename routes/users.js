
var express = require('express');
var router = express.Router();

var passport = require('passport');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user.js');
var data = require('../models/data.js');

var Instdata = require('../models/Instdata.js');
var dataStatus = require('../controller/dataStatus.js')

/* ABOUT ROUTER
------------------------------------------------*/
router.get('/about', function (req, res, next) {
    res.render('about')
})

/* AUTHENTICATION ROUTES
   SIGN UP PAGES
------------------------------------------------*/ 

router.get('/register', function (req, res) {
    res.render('register.ejs')
})


router.post('/register', function (req, res) {

    var name = req.body.name
    var email = req.body.email
    var username = req.body.username
    var password = req.body.password
    var password2 = req.body.password2
    
// form validator
req.checkBody('name', 'Name field is required').notEmpty()
req.checkBody('email', 'Email field is required').notEmpty()
req.checkBody('email', 'Email is not valid').isEmail()
req.checkBody('username', 'Username field is required').notEmpty()
req.checkBody('password', 'Password field is required').notEmpty()
req.checkBody('password2', 'Password do not match').equals(req.body.password)


// check errors
var errors = req.validationErrors();

if(errors){
    res.render('register',{
        errors:errors
  })
}else{
    var newUser = new User()
    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.username = req.body.username;
    newUser.password = req.body.password;
    newUser.password2 = req.body.password2;
    
    
};
    User.create(newUser, function(err, user){
        // newuser.save(function (err, savedUser) {
        if (err) throw err;
            console.log(user)
            return res.status(500).send()
            return res.render('register')
        });
            req.flash('success','You are now registered and authorized to login!')
            res.location('/login')
            res.redirect('/login')
    })

    
/* LOGIN RENDERING PAGE
--------------------------------------*/
router.get('/login', function (req, res) {
    res.render('login.ejs')
}) 

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');

    }
}

router.post('/login', passport.authenticate('local', {failureRedirect: '/login' ,failureFlash:'Invalid username pssword or project name'}),
        function(req,res){
            req.flash('success','You are now logged in!');
            res.render('home');
        }) 
        passport.use(new LocalStrategy(User.authenticate()));
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());
        
        passport.use(new LocalStrategy(function(username, password, done){
            User.findOne({
                username:username,
                password:password,
                
            }, function(err,user){
                // This is how you handel error
                if(err) return done(err);
                // when user is not found
                if(!user) return done(null, false);
                // when password is not correct
                if(!user.authenticate(password)) return done(null, false);
                // when all things are correct, we return the user
                return done(null, user)
            });
        }));
              
        

/* LOGIN LOGIC
   MIDDLEWARE
----------------------------------------*/

router.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;    
User.findOne({ username: username, password: password }, function (err, user) {
        if (err) {
            console.log(err)
            return res.status(500).send()
        }
        if (!user) {
            return res.status(404).send()

        }
           res.redirect('/datas')
           return res.status(200).send()

    })
})

/* LOGOUT PAGE
------------------------------------------*/ 
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'You are now logged out!!')
    res.redirect('/');
})

/* RETRIEVES ALL DATA FROM THE DATABASE DATA
-------------------------------------------------*/

var pipelineSrt = [
                     {
                       '$sort': {
                           'Date': -1
                          }
                     }
                   ]

router.get("/datas", ensureAuthenticated, function (req, res) {
    
    data.aggregate(pipelineSrt, function (err, datas) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render("datas.ejs", { datas: datas });
            console.log("All the datas are retrieved from the database")
        }
    })
})




/* CREATES DATA AND REDIRECTS TO ROUTE - /datas
-----------------------------------------------*/
router.post("/addata", function (req, res) {
        
   function dateInpute() {
        var d = new Date();
        var D = d.getDate();
        var M = d.getMonth();
        var Y = d.getFullYear();
        var date = D + "/" + M + "/" + Y;
        return date;
    }

    var Ln = req.body.layerno;
    if (Ln === "1") {
        var Ppic = "MatPic/img1.jpg";
    }
    else if (Ln === "2") {
        Ppic = "MatPic/img2.jpg";
    }
    else if (Ln === "3") {
        Ppic = "MatPic/img3.jpg";
    }
    else if (Ln === "4") {
        Ppic = "MatPic/img4.jpg";
    }
    else {
        Ppic = "MatPic/img5.jpg"
    }

    function layer() {
        var StT = req.body.stationF
        var Lno = req.body.layerno
        if (StT >= 20 && Lno === "1") {
            Lim = "MatPic/pic1.jpg"
        } else if (StT >= 20 && Lno === "2") {
            Lim = "MatPic/piC2.jpg"
        } else if (StT >= 20 && Lno === "3") {
            Lim = "MatPic/piC3.jpg"
        } else if (StT >= 20 && Lno === "4") {
            Lim = "MatPic/piC4.jpg"
        } else if (StT >= 20 && Lno === "5") {
            Lim = "MatPic/piC5.jpg"

        } else {
            Lim = "MatPic/pi6.jpg"
        }
        return Lim;
    }
    function volume() {
        V = ((req.body.stationT - req.body.stationF) * (req.body.Rwidth) * (req.body.thickness) * 0.001 * (req.body.shrnk));
        return V;
    }

    var P = req.body.picture;
    if (P) {
        P = req.body.picture;
    } else {
        P = "000.jpg";
    };

// Color match with fill type

    if (req.body.filltype === "Rock fill") {
         Col = "A";
    }

     else if (req.body.filltype === "G3") {
         Col = "B";
    }
    else if (req.body.filltype === "G7") {
        Col = "C";
    }
    else if (req.body.filltype === "G15") {
       Col = "D";
    }
    else if (req.body.filltype === "Sub base") {
        Col = "E";
    }
     else {
       Col = "F";
    }
 
    // Thickness match with fill layer number 
    
    if (req.body.layerno === "1") {
        Lyr = "L1";
   }

    else if (req.body.layerno === "2") {
        Lyr = "L2";
   }
   else if (req.body.layerno === "3") {
       Lyr = "L3";
   }
   else if (req.body.layerno === "4") {
      Lyr = "L4";
   }
   else if (req.body.layerno === "5") {
       Lyr = "L5";
   }
    else {
      Lyr = "L6";
   }

//    function PrSelection(){
//        if(req.body.Prname === "1"){
//            var choice = data
//        }else{
//                 console.log('no database is selected!!')
//        }return choice;
//    }

   data.create({
               PrjNm: req.body.PrjNm,
               TotExc: req.body.TotExc,
               stationF: req.body.stationF,
               stationT: req.body.stationT,
               filltype: req.body.filltype,
               layerno: req.body.layerno,
               thickness: req.body.thickness,
               Quantity: req.body.Quantity,
               approval: req.body.approval,
               supervisor: req.body.supervisor,
               Date: dateInpute(),
               comment: req.body.comment,
               picture: P,
               profile: Ppic,
               layerIm: layer(),
               Rwidth: req.body.Rwidt,
               shrnk: req.body.shrnk,
               BPname: req.body.BPname,
               Evolume: volume(),
               MatCol: Col,
               MatLyr: Lyr,
               
               
        
    }, function (err, data) {
        if (err) {
            console.log("You have an error");
            console.log(err);
        //} else if (req.body.PrjNm === ""){
          //  alert("This activity has no Plan! Please enter its Plan.");
        } else {
            console.log('A new data is added to the database');
            res.redirect("/datas")
        }
    
     }) 

})

/* RENDER ACTIVITY SUMMARY PAGE
------------------------------------------*/

//router.route("/stats").get(dataStatus.getdataStatus)

router.get("/datas1", function (req, res) {
    // var pipeline = [
    //     {
    //       '$match': {}
    //      }, {
    //       '$group': {
    //          '_id':'$filltype',
    //          'Plan': {'$sum': '$TotExc'},          
    //          'Tot_Quantity': {'$sum': '$Quantity'},
             
    //         }
    //      }
    //   ];

     var pipeline = [
        {
              '$match': {}
            }, {
              '$group': {
                '_id': '$filltype', 
                'Plan': {
                  '$sum': '$TotExc'
                }, 
                'Tot_Quantity': {
                  '$sum': '$Quantity'
                }
              }
            }, {
              '$project': {
                'Plan': {
                  '$add': [
                    '$Plan', 0
                  ]
                }, 
                'Tot_Quantity': {
                  '$add': [
                    '$Tot_Quantity', 0
                  ]
                }, 
                'RemQuant': {
                  '$subtract': [
                    '$Plan', '$Tot_Quantity'
                  ]
                }, 
                'Progress': {
                  '$divide': [
                    '$Tot_Quantity', '$Plan'
                  ]
                }
              }
            }, {
              '$project': {
                'Plan': {
                  '$add': [
                    '$Plan', 0
                  ]
                }, 
                'Tot_Quantity': {
                  '$add': [
                    '$Tot_Quantity', 0
                  ]
                }, 
                'RemQuant': {
                  '$subtract': [
                    '$Plan', '$Tot_Quantity'
                  ]
                }, 
                'Progress': {
                  '$divide': [
                    '$Tot_Quantity', '$Plan'
                  ]
                }, 
                'Prog': {
                  '$multiply': [
                    '$Progress', 100
                  ]
                }
              }
            }, {
              '$project': {
                'Plan': {
                  '$add': [
                    '$Plan', 0
                  ]
                }, 
                'Tot_Quantity': {
                  '$add': [
                    '$Tot_Quantity', 0
                  ]
                }, 
                'RemQuant': {
                  '$subtract': [
                     '$Plan', '$Tot_Quantity'
                  ]
                }, 
                'Progress': {
                  '$divide': [
                    '$Tot_Quantity', '$Plan'
                  ]
                }, 
                'Pro': {
                  '$round': [
                    '$Prog', 2
                  ]
                }
              }
            }
          ]
                   
    data.aggregate(pipeline, function (err, datas1) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render("datas1.ejs", { datas1: datas1 });
            console.log("A summary page is retrieved from the database")

        }
    })
})


 /* RETRIEVES ALL DATA FROM THE DATABASE DATA PER PROJECT
-------------------------------------------------*/

var pipelineSrt = [
    {
      '$sort': {
          'Date': -1
         }
    }
  ]
  
  
  router.post("/findPrjdata", function (req, res) {
    var thePrjNm = req.body.PrjNm;
    
    data.find({ PrjNm: thePrjNm}, function (err, datas) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render("datas.ejs", { datas: datas });
            console.log("Project data is retrieved from the database");

        }
    })
})



/* RETRIEVES PLAN DATA FROM THE DATABASE DATA
-------------------------------------------------*/

router.get("/datas2", ensureAuthenticated, function (req, res) {
    
    var pipelineA = [
        
        {
            '$match': {}
        }, {
            '$group': {
                '_id': '$filltype', 
                'PrjNm': {
                    '$first': '$PrjNm'
                }, 
                'Plan': {
                    '$sum': '$TotExc'
                }
            }
        }
    ]

    data.aggregate( pipelineA, function (err, datas2) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render("datas2.ejs", { datas2: datas2 });
            console.log("All Plan quantity datas are retrieved from the database")
        }
    })
})






/* RENDER PROFILE PAGE
------------------------------------------*/

router.get("/comment", function (req, res) {
    data.find({}, function (err, comment) {
        if (err) {
            console.log("you have an error!!!");
            console.log(err)
       } else {
            res.render("comment.ejs", { comment: comment });
            console.log("Comments and pictures are displayed successfuly!!")
        }
    }).sort({ stationF: -1 })
})
/* RENDER SUMMARY PAGE
------------------------------------------*/

// router.get("/Rprofile", function (req, res) {
    // data.find({}, function (err, Rprofile) {
        // if (err) {
            // console.log("you have an error!!!");
            // console.log(err)
        // } else {
            // res.render("Rprofile.ejs", { Rprofile: Rprofile });
            // console.log("Road profile pictures are displayed successfuly!!")
        // }
    // }).sort({ stationF: -1 })
// })
/* RENDER ROAD MAP PAGE
------------------------------------------*/

router.get("/RdMap", function (req, res) {
    data.find({}, function (err, RdMap) {
        if (err) {
            console.log("you have an error!!!");
            console.log(err)
        } else {
            res.render("RdMap.ejs", { RdMap: RdMap });
            console.log("Road map is displayed successfuly!!")
        }
    }).sort({ stationF: -1 })
})


/* RETRIEVES DATA BY STATION
------------------------------------------*/

router.post("/findata", function (req, res) {
    var theStation = req.body.stationF;
    data.find({ stationF: theStation }, function (err, datas) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render("datas.ejs", { datas: datas });
            console.log("A new data is retrieved from the database");

        }
    }).sort({ stationF: -1 })
})

/* RETRIEVES DATA BY DATE
------------------------------------------*/

//router.post("/findata", function (req, res) {
  //  var theDate = req.body.Date;
    //data.find({ Date: theDate }, function (err, datas) {
      //  if (err) {
        //    console.log("You have an error")
          //  console.log(err)
        //} else {
          //  res.render("datas.ejs", { datas: datas });
            //console.log("A new data is retrieved from the database");

        //}
    //}).sort({ stationT: -1 })
//})

/* RETRIEVES DATA BY FILL TYPE FROM /datas ROUTER
-------------------------------------------------*/

router.post("/findfilltype", function (req, res) {
    var thefilltype = req.body.filltype;
    data.find({ filltype: thefilltype }, function (err, datas) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render("datas.ejs", { datas: datas });
            console.log("A new data is retrieved from the database");

        }
    }).sort({ stationF: -1 })
})

/* RETRIEVES DATA BY FILL TYPE FROM ROAD MAP ROUTER
--------------------------------------------------*/
router.post("/Mapfilltype", function (req, res) {
    
    var thefilltype = req.body.filltype;
    if(thefilltype) {
        data.find({filltype: thefilltype}, function (err, RdMap) {
            if (err) {
                console.log("You have an error")
                console.log(err)
            } else {
                res.render("RdMap.ejs", { RdMap: RdMap });
                console.log("A new data is retrieved from the database");
    
            }
        }).sort({ stationF: -1 })
    }else{
        data.find({}, function (err, RdMap) {
            if (err) {
                console.log("You have an error")
                console.log(err)
            } else {
                res.render("RdMap.ejs", { RdMap: RdMap });
                console.log("A new data is retrieved from the database");
    
            }
        }).sort({ stationF: -1 })
    
    }
    })
  
    
/* REMOVES DATA FROM THE DATABASE data
-------------------------------------------*/
router.post("/deletedata", function (req, res) {
    var thestationF = req.body.stationF;
    data.remove({ stationF: thestationF }, function (err, datas) {

        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            console.log("A new data is deleted from the database");
            res.redirect("/datas");
        }
    })
})

/* REMOVES FILLTYPE-DATA FROM THE DATABASE data
-------------------------------------------*/
router.post("/deletePlan", function (req, res) {
    var thefilltype = req.body.filltype;
    data.remove({ filltype: thefilltype }, function (err, datas) {

        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            console.log("A Plan data is deleted from the database");
            res.redirect("/datas2");
        }
    })
})


/* RETRIEVES DATA FROM THE DATABASE Instdata
-------------------------------------------*/

router.get('/Instdatas',ensureAuthenticated, function (req, res, next) {
    
    Instdata.find({}, function (err, Instdatas) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render('InstdatasA', { Instdatas: Instdatas });
            console.log("An Engineer's Instruction document is retrieved from the database");

        }
    }).sort({ stationT: -1 })
})
 
/* ADD DATA TO THE DATABASE Instdata
-------------------------------------------*/

router.post('/addInstdatas',function(req,res,next){

    function dateInpute() {
        //var d = new Date();
        var D = d.getDate();
        var M = d.getMonth();
        var Y = d.getFullYear();
        var date = M + "/" + D+ "/" + Y;
        return date;
    }
      

    Instdata.create({
    Prname: req.body.Prname,
    formname:req.body.formname,
    date: dateInpute(),
    title:req.body.title,
    stationF: req.body.stationF,
    stationT: req.body.stationT,
    engname: req.body.engname,
    instr:req.body.instr,
    sign: req.body.sign,
    pass: req.body.pass
    
}, function (err, Instdatas) {
    if (err) {
        console.log("You have an error")
        console.log(err)
    } else {
        console.log("A new data is added to the database");
        res.redirect('/Instdatas')
    }

})
})

/* RETRIEVES DATA FROM THE DATABASE Instdata BY STATION
-------------------------------------------------------*/

router.post("/findInstdatas", function (req, res) {
    
    var thestationF = req.body.stationF;
    var thestationT = req.body.stationT;
    
    Instdata.find({stationF: thestationF, stationT:thestationT }, function (err, Instdatas) {
        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            res.render('Instdatas', { Instdatas: Instdatas });
            console.log("An Engineer's Instruction document is retrieved from the database");

        }
    }).sort({ stationT: -1 })
})
/* REMOVES DATA FROM THE DATABASE Instdata
-------------------------------------------*/

router.post("/deleteInstdatas", function (req, res) {
    var form = req.body.formname;
    Instdata.remove({ formname: form }, function (err, Instdatas) {

        if (err) {
            console.log("You have an error")
            console.log(err)
        } else {
            console.log("An Instraction data is deleted from the database");
            res.redirect("/Instdatas");
        }
    })
})

/* RETRIEVES SUM OF DATA FROM THE DATABASE DATA
-------------------------------------------------*/

//router.post('/sum',(req,res)=>{
    //const fill = data.aggregate([{$group: {
    //_id: 'filltype',
    //Total: {$sum: '$Evolume'}
   //}}]);
   //let Total = 0;
   //if(result.length > 0) {
    //Total += result[0].Total;
   //}
   //return Total;
//})

//router.get('/values/:id', (req, res, next) => {
    //Value.aggregate([
        //{
            //$match: { id: req.params.id }
        //},
        //{ 
           // $group: {
             //   _id: "id",
               // total: { $sum: "$price" }
            //}
        //}
    //], function (err, value){
    //    console.log(value);
    //});
//});


module.exports = router;