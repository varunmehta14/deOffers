const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Register = require("../models/user.model");
require("dotenv").config();

router.post("/", async (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;

  let user = await Register.findOne({ email });
  if (!user) return res.status(400).send("Invalid Email or Password");

  const validPass = await bcrypt.compare(pass, user.pass);

  if (!validPass) console.log("Invalid Password");
  else console.log("Password matches succesfully logged in");

  if (!validPass) return res.status(400).send("Invalid Email or Password");

  const token = user.generateAuthToken();

  res.send(token);
});

module.exports = router;
