const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/user.model");

exports.getAllUsers=async (req, res) => {
    User.find()
    // .populate("tasks")
    .then((register) => res.json(register))
    .catch((err) => res.status(400).json("Erro: " + err));
};

exports.getUser=async (req, res) => {
    const user = await User.findById(req.params.id).populate(
		'followers following'
	);
	console.log("user",user)
	if(!user) {
		// Create user
		let newUser = new User({
			walletAddress
		});
		await newUser.save();

		res.status(200).json(newUser);
	}
	else {
		res.status(200).json(user);
	}
}
exports.updateUser = async (req, res) => {
	const { walletAddress } = req.params;
	console.log("req",req.body)
	const ad = await User.findOne({ walletAddress: walletAddress });
	console.log("ad",ad)
  if(!ad.isAdmin && req.body.isAdmin) req.body.isAdmin = false;

	const updatedUser = await User.findByIdAndUpdate(ad._id, req.body, {
		new: true,
	}).populate(
		'followers following'
	);
	return res.status(200).json(updatedUser);
};
exports.createUser=async (req, res) => {
    const walletAddress= req.body.walletAddress;
    const name = req.body.name;
    const pass = req.body.pass;
    const isAdmin = req.body.isAdmin;
    const profilePic= req.body.profilePic;
    const followers= [];
    const following= [];
   

  
    let user = await User.findOne({ walletAddress });
    if (user) return res.status(400).send("User already registered");
  
    user = new User({ walletAddress,name, pass,isAdmin,profilePic,followers,following });
    const salt = await bcrypt.genSalt(10);
    user.pass = await bcrypt.hash(pass, salt);
    console.log("Encrypted Hashed password :- " + user.pass);
    user.save();
  
    const token = user.generateAuthToken();
  
    // const x = _.pick(user, ["_id", "name", "email", "tasks"]);
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(user);
    };