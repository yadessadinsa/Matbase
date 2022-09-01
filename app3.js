//==============================================
//SET UP
//==============================================
var express = require('express'),
    app = express(),
    $ = require('jquery'),
    bodyParser = require('body-parser')

app.set('view.engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
// Instruction to use css & image files location
app.use(express.static(__dirname + "/public"));

//=============================================
//Database
//=============================================
mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Data_app');
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

var loginSchema = new mongoose.Schema({
    username:"string", 
    password: "string",
            
})
var login = mongoose.model('login', loginSchema)
//============================================
//ROUTES
//============================================

// Members/Home page
app.get("/", function(req, res){
    res.render("login.ejs")
})

// login page
app.get("/login", function(req, res){
       res.render("home.ejs")
    })  

app.get("/register", function(req,res){
    res.render("register.ejs")
})

app.post("/pass", function(req, res){
    login.create({
        username: req.body.username,
        password: req.body.password
        },function(err){
            if(err){
                console.log("there is login error!!")     
            }else{
                console.log("you have created your username or password succesfuly!!")
                res.redirect("/")
            }
        })
        
})

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
   
    
    // var Ln = req.body.layerno;
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
            console.log("A new data is added to the database");
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
         console.log("The server is not lisenining, Error!!!");
         console.log(err);
     }else
    console.log("The server has started successfuly!!")
    
})
