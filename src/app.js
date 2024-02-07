const express = require("express");
const app = express();
const port = process.env.PORT || 1000;
const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const Register = require("./models/model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("./db/conn");

app.use(bodyParser.urlencoded({ extended: true }));

const staticPath = path.join(__dirname, "../public");
const partialPath = path.join(__dirname, "../templates/partials");
const templatePath = path.join(__dirname, "../templates");
app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatePath);

hbs.registerPartials(partialPath);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

// Login Form
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userEmail = await Register.findOne({ email: email });

    const isMatch = await bcrypt.compare(password, userEmail.password);

    if (isMatch) {
      res.status(201).render("home");
    } else {
      res.send("Invalid Login Credentials");
    }
  } catch (err) {
    res.status(400).send("Some error has occured");
  }
});

// Sign-Up Form
app.post("/signup", async (req, res) => {
  try {
    const password = req.body.pass;
    const cpassword = req.body.cpass;

    if (password === cpassword) {
      const registerPerson = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        password: req.body.pass,
        confirmpassword: req.body.cpass,
      });

      console.log(registerPerson);
      const token = await registerPerson.generateAuthToken();
      console.log(token);

      // password hashing done at models.js using bcrypt -- middleware
      const registered = await registerPerson.save();
      console.log(registered);
      res.status(201).render("index");
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

app.listen(port, () => {
  console.log(`Listening to port no ${port}`);
});
