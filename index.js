var fs = require('fs');
const users = require("./data");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

let app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


let currentuser

app.get("/",function(req,res){
  res.render("login")
})

app.get("/signup",function(req,res){
  res.render("signup",{name:"",e1:null})
})
app.get("/success/:postname",function(req,res){
  const requestedtitle=req.params.postname;
  for(var i=0;i<users.length;i++){
    if(requestedtitle==users[i].name)
    break;
  } 
    res.render("success",{name:users[i].name,array:users[i].Messages})
})

app.post("/success/:postname",function(req,res){
  const requestedtitle=req.params.postname;

     for(var i=0;i<users.length;i++){
      if(req.body.person===users[i].name){
        users[i].Messages.push([requestedtitle,req.body.message])
        fs.writeFile("data.json", JSON.stringify(users), err => {
          if (err) throw err; 
          console.log("Done writing"); // Success
            });
            var x="/success/"+requestedtitle
        res.redirect(x)
        break;
      }
    }
})

app.post("/login",function(req,res){
      for(i=0;i<users.length;i++){
        if(users[i].name===req.body.email&&users[i].pass===req.body.psw){
          var x=users[i].name
          x="/"+"success/"+x
        res.redirect(x)
        break;
        }
      } 
 
 

})
//string password check function.......
var checkpass=function(x){
  if(x.length<5)
  return false
  else
  return true
}
app.post("/signup",function(req,res){
  const Post={
    name:"",
    pass:"",
    Messages:[],
  }
  if(checkpass(req.body.psw)){
  Post.name=req.body.email
  Post.pass=req.body.psw
  users.push(Post);
   
      fs.writeFile("data.json", JSON.stringify(users), err => {
    if (err) throw err; 
    console.log("Done writing"); // Success
      });
      res.redirect("/")
    }
    else{
      res.render("signup",{name:"change password",e1:req.body.email})
    }

})


// app.get("/posts/:postname",function(req,res){
//   const requestedtitle=req.params.postname;

  
// })






app.listen(process.env.PORT||3000, function() {
    console.log("Server started on port 3000");
  });
 