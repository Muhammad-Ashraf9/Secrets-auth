require("dotenv").config();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const md5 = require("md5");
const app = express();
const port = 3000;
const bcrypt = require("bcrypt");
const saltRounds = 10;

mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/userDB");
}

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    if (!err) {
      const newUser = new User({
        email: req.body.username,
        password: hash,
      });
      newUser.save((err) => {
        if (!err) {
          res.render("secrets");
        } else {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
});
app.post("/login", (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({ email: userName }, (error, foundUser) => {
    if (!error) {
      bcrypt.compare(password, foundUser.password, function (err, result) {
        if (result == true) {
          res.render("secrets");
        } else {
          console.log(err);
        }
      });
    } else {
      console.log(error);
    }
  });
});
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
