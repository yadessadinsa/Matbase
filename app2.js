
//==============================================
//SET UP
//==============================================
var express = require('express');
var app = express();
var $ = require('jquery')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var  bodyParser= require('body-parser');
var User = ("./models/user");
var session = require('express-session');
var passport = require('passport');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var upload = multer({dest:'./uploads'})
var flash = require('connect-flash');  
    
// View engine setup
app.set('view.engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));
// app.use(logger,'dev');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Static files location

app.use(express.static(__dirname + "/public"));
// app.use(express.static(path.join(__dirname, + '/public')));
// Using routes folder
// var routes = require('./routes/index');
// var users  = require('./routes/users');

// Handel sessions

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport

app.use(passport.initialize());
app.use(passport.session());

// Validator

app.use(expressValidator({
    errFormatter: function(param, msg, value){
        var namespace = param.split('.')
        ,root = namespace.shift()
        , formparam = root;

        while(namespace.length){
            formparam += '[' + namespace.shift()
        }
        return{
            param: formpram,
            msg: msg,
            value: value
        };
    }
}));

app.use(require('connect-flash')());
app.use(function(req, res, next){
    res.locals.messages = require(express-messages);
    next();
});


// app.use('/', routes);
// app.use('/users', users);


app.use(function(req,res,next){
    var err = new error('Not Found');
    err.status = 404;
    next(err);
})

//============================================
// DATABASE-MAIN DATA
//============================================
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.connect('mongodb://localhost/Data_app');
 var data = mongoose.connection;

var dataSchema = new mongoose.Schema({
    Prname:"string", 
    stationF: "string",
     stationT: "string",
     filltype: "string",
     layerno: "number",
     thickness: "number",
     compaction: "number",
    approval: "string",
    supervisor: "string",
    Date: "string",
    comment:"string",
    picture:"string",
    profile: "string",
    layerIm:"string",
    Evolume:"number",
    shrnk:"number",
    BPname:"string"    
})
var data = mongoose.model('data', dataSchema)


//============================================
//ROUTES REGISTER & LOGIN
//============================================

app.get('/', ensureAuthenticated, function(req, res, next){
    res.render('home', {title:'Home'});
});

function ensureAuthenticated(req , res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
    res.redirect('/users/login');

    }
}    


app.get('/', function(req, res, next){
    res.send('respond with resource');
});
app.get('/register', function(req, res, next){
    res.render ('register',{title:'register'});
});
app.get('/login', function(req, res, next){
    res.render ('login',{title:'login'});
});


app.post('/login', passport.authenticate('local', {failureRedirect: '/users/login' ,failureFlash:'Invalid username or password'}),
        function(req,res){
            req.flash('success','You are now logged in!');
            res.redirect('/');
        }) 
        
passport.serializeUser(function(user, done){
    done(null, user.id);
})
passport.deserializeUser(function(id, done){
    User.getUserById(id, function(err, user){
        done(err, user)
    });
})

    passport.use(new LocalStrategy(function(username, password, done){
    User.getUserbyUsername(username, function(err, user){
        if(err) throw err;
        if(!user){
            return done(null, false, {message:'unknown User'})
        }
        User.comparePassword(password,user.password, function(err){
            if(err) return done(err);
            if(isMatch){
                return done(null, user)
            }else{
                return done(null, false, {message:'Invalid password!'})
            }
        })
    })
}))

app.post('/register', function(req, res, next){
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
req.checkBody('password2', 'Password do not match').equal(req.body.password)

// check errors
var errors = ValidationErrors()

if(errors){
    res.render('register')
         errors:errors
}else{
    var newUser = new User({
        name: name,
        email: email,
        username: username,
        password: password
                
    })
    User.createUser(newUser, function(err, User){
        if (err) throw err;
        console.log(User);
    })
    req.flash('success', 'You are now registered and can login!')
    res.location('/');
    res.redirect('/');
  }
});

app.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are now loged out!');
    res.redirect('/users/login');
})

//============================================
//ROUTES MAIN DATA
//============================================

// Retrieves all data from the database

app.get("/datas", function(req, res){
    var Pr = req.body.Prname
    data.find({Prname:Pr}, function(err,datas){
           if(err){
            console.log("You have an error")
            console.log(err)
        }else{
            res.render("datas.ejs",{datas:datas});
            console.log("All the datas are retrieved from the database")
        }
 }).sort({stationF:-1})
})

// Creates data and redirects to Route - /datas
app.post("/addata",function(req, res){
        function dateInpute(){
        var d = new Date();
		var D = d.getDate();
		var M = d.getMonth();
		var Y = d.getFullYear();
		var date = D + "-" + M + "-" + Y;
        return  date;
    }
   
    
    var Ln = req.body.layerno;
    if(Ln=== "1"){
      var Ppic = "MatPic/img1.jpg";
    } 
    else if(Ln=== "2"){
         Ppic = "MatPic/img2.jpg";
    }   
    else if(Ln=== "3"){
        Ppic = "MatPic/img3.jpg";
    }   
    else if(Ln=== "4"){
        Ppic = "MatPic/img4.jpg";
    }
    else{
        Ppic = "MatPic/img5.jpg"
    }
    
  function layer(){  
    var StT =req.body.stationF
    var Lno =req.body.layerno
  if(StT >= 20 && Lno === "1"){
    Lim = "MatPic/pic1.jpg"
  }else if(StT >= 20 && Lno === "2"){
    Lim = "MatPic/piC2.jpg"
    }else if(StT >= 20 && Lno === "3"){
    Lim = "MatPic/piC3.jpg"
  }else if(StT >= 20 && Lno === "4"){
    Lim = "MatPic/piC4.jpg"
  }else if(StT >= 20 && Lno === "5"){
    Lim = "MatPic/piC5.jpg"

  }else{
    Lim = "MatPic/pi6.jpg"
  }
    return Lim;
  }
    function volume(){
        V = ((req.body.stationT-req.body.stationF)*(req.body.Rwidth)*(req.body.thickness)*0.001*(req.body.shrnk));
        return V;
    }

    var P = req.body.picture;
    if(P){
        P = req.body.picture;
    }else{
         P = "000.jpg";
    }
    data.create({
        Prname:req.body.Prname,
        stationF: req.body.stationF,
        stationT: req.body.stationT,
        filltype: req.body.filltype,
        layerno: req.body.layerno,
        thickness: req.body.thickness,
        compaction: req.body.compaction,
       approval: req.body.approval,
        supervisor: req.body.supervisor,
        Date: dateInpute(),
        comment: req.body.comment,
        picture: P,
        profile: Ppic,
        layerIm:layer(),
        Rwidth:req.body.Rwidt,
        shrnk:req.body.shrnk,
        BPname:req.body.BPname,
        Evolume:volume()

    },function(err,data){
        if(err){
            console.log("You have an error")
            console.log(err)
        }else{
            console.log("A new data is added to the database")
                
            res.redirect("/datas")
        }
       
     })
})
// Renders profile page
app.get("/comment", function(req, res){
    data.find({}, function(err, comment){
        if(err){
            console.log("you have an error!!!");
            console.log(err)
        }else{
            res.render("comment.ejs", {comment:comment});
            console.log("Comments and pictures are displayed successfuly!!")
        }
    }).sort({stationF:-1})
})
// Renders summary page
app.get("/Rprofile", function(req, res){
    data.find({}, function(err, Rprofile){
        if(err){
            console.log("you have an error!!!");
            console.log(err)
        }else{
            res.render("Rprofile.ejs", {Rprofile:Rprofile});
            console.log("Road profile pictures are displayed successfuly!!")
        }
    }).sort({stationF:-1})
})
// Renders Road map page
app.get("/RdMap", function(req, res){
    data.find({}, function(err, RdMap){
        if(err){
            console.log("you have an error!!!");
            console.log(err)
        }else{
            res.render("RdMap.ejs", {RdMap:RdMap});
            console.log("Road map is displayed successfuly!!")
        }
    }).sort({stationF:-1})
})


//  Retrieves data by station
app.post("/findata", function(req,res){
      var theStaion = req.body.stationF;
      data.find({stationF:theStaion}, function(err,datas){
    if(err){
        console.log("You have an error")
        console.log(err)
    }else{
        res.render("datas.ejs", {datas:datas});
        console.log("A new data is retrieved from the database");
        
    }
  }).sort({stationT:-1})
})

// Retrieves data by fill type for datas page
app.post("/findfilltype", function(req,res){
      var thefilltype = req.body.filltype;
      data.find({filltype:thefilltype}, function(err,datas){
    if(err){
        console.log("You have an error")
        console.log(err)
    }else{
        res.render("datas.ejs", {datas:datas});
        console.log("A new data is retrieved from the database");
        
    }
  }).sort({stationF:-1})
})

// Retrieves data by fill type for Road map page
app.post("/Mapfilltype", function(req,res){
      var thefilltype = req.body.filltype;
      data.find({filltype:thefilltype}, function(err,RdMap){
    if(err){
        console.log("You have an error")
        console.log(err)
    }else{
        res.render("RdMap.ejs", {RdMap:RdMap});
        console.log("A new data is retrieved from the database");
        
    }
  }).sort({stationF:-1})
})

// Removes data from the database
app.post("/deletedata", function(req,res){
      var theStaion = req.body.stationF;
      data.remove({stationF:theStaion}, function(err,datas){
          
    if(err){
        console.log("You have an error")
        console.log(err)
    }else{
        console.log("A new data is deleted from the database");
        res.redirect("/datas");
    }
  })
})


app.listen(8080, function(err){
    if(err){
        console.log('The server is not responding!!')
    }else{
        console.log('The server is runnining succesfuly!!')
    }
})

