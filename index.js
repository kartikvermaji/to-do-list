//jshint esversion:6
//constants
const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const date=require(__dirname+"/date.js")

//setting app
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extends: true }));
app.use(express.static('assets'))

//itemsarray
let items=["buy food","cook food"];
let work=[];

app.get("/", function (req, res) {
  let today=date.getday();
 
  res.render("list", { kindofday:today,itemss:items });
});

app.get('/work',function(req,res){
  res.render('list',{kindofday:"WORKLIST",itemss:work})
})

app.get('/about',function(req,res){
  res.render("about");
})

app.post('/',function(req,res){
     let newitem=req.body.item;
    if(req.body.adding=='WORKLIST'){
      work.push(newitem);
      res.redirect('/work')
    }
    else{
      items.push(newitem);
      res.redirect('/');
    }

})

//listening port
app.listen(3000, function (err) {
  if (err) {
    console.log("here is the error: ", err);
  }
  console.log("server is up and running");
});
