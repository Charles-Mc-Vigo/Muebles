const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");

// const phoneNumberRegex = /^(09|\+639)\d{9}$/;

// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])/;

exports.SignUp = async (req, res) => {
  try {
    const { firstname, lastname, phoneNumber, streetAddress, municipality, email, password, confirmPassword } = req.body;

    if (!firstname || !lastname || !phoneNumber || !streetAddress || !municipality || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: "Account or phone number is already existing" });
    }

    if (!validator.isMobilePhone(phoneNumber,"en-PH")) {
      return res.status(400).json({ message: "Invalid phone number!" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email account!" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: "Passwords is weak!" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ firstname, lastname, phoneNumber, streetAddress, municipality, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({message:"Account created successfully!",newUser:newUser});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.LogIn = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(!user){
      return res.status(404).json({message:"Unrecognized account"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    res.status(200).json({message:"Login successfull"})
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserByID = async (req,res)=>{
  try {
    const {id} = req.params
    const user = await User.findById(id);

    if(!user){
      return res.status(404).json({message:"User not found!"})
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({message: err.message});
    console.log(error)
  }
}
