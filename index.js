//jshint esversion:6
//constants
const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");
const _=require('lodash');

//SETTING UP THE DATABASE
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://kartikvermaji03:%40Kartik127@cluster0.axooytt.mongodb.net/todolist", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const todoschema = new mongoose.Schema({
  title: String,
});
const task = new mongoose.model("task", todoschema);
const buy = new task({
  title: "buy food",
});
const cook = new task({
  title: "cook food",
});
const eat = new task({
  title: "eat food",
});
//list of items
const defaultitems = [buy, cook, eat];
//insertmany

//consoling

//setting app
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extends: true }));
app.use(express.static("assets"));

//itemsarray
let work = [];

app.get("/", function (req, res) {
  let today = date.getday();
  task
    .find()
    .then(function (tasks) {
      if (tasks.length === 0) {
        task
          .insertMany(defaultitems)
          .then(() => {
            console.log("Task saved successfully.");
          })
          .catch((err) => {
            console.error("Error while saving: " + err);
          });
        res.redirect("/");
      } else {
        res.render("list", { kindofday: "today", itemss: tasks });
      }
    })
    .catch(function (err) {
      console.error("Error while querying: " + err);
    });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.post("/", function (req, res) {
  let newitem = req.body.item;
  const listname=req.body.adding;

  const newtask = new task({
    title: newitem,
  });
  if(listname==="today"){
    newtask.save();
    res.redirect("/");
  }else{
    list2.findOne({name:listname})
    .then((tasks) => {
      tasks.items.push(newtask);
      tasks.save();
      res.redirect('/'+listname)
    })
    .catch((err) => {
      console.error("Error while querying: " + err);
    });
  }
  
});

app.post("/delete", function (req, res) {
  const checkid = req.body.checkbox;
  const submitname=req.body.hiddeninp;

  if(submitname==="today"){
    task
    .findByIdAndDelete(checkid)
    .then(() => {
      console.log("Task deleted successfully.");
    })
    .catch((err) => {
      console.error("Error while deleting: " + err);
    });
  res.redirect("/");
  }else{
    list2.findOneAndUpdate({name:submitname},{$pull:{items:{_id:checkid}}})
  .then((updatedTask) => {
    console.log("Task updated: ", updatedTask);
    res.redirect('back');
  })
  .catch((err) => {
    console.error("Error while updating: " + err);
  });
  }

  
});

const listschema = new mongoose.Schema({
  name: String,
  items: [todoschema],
});
const list2 = mongoose.model("list2", listschema);

app.get("/:paramname", function (req, res) {
  const newestname = _.capitalize(req.params.paramname);
  list2
    .findOne({ name: newestname })
    .then((tas) => {
      if (!tas) {
        const listitem = new list2({
          name: newestname,
          items: defaultitems,
        });
        listitem.save();
        res.redirect('/'+newestname);

      } else {
        res.render("list", { kindofday: tas.name, itemss: tas.items });
      }
    })
    .catch((err) => {
      console.error("Error while querying: " + err);
    });
});

//listening port
app.listen(3000, function (err) {
  if (err) {
    console.log("here is the error: ", err);
  }
  console.log("server is up and running");
});
