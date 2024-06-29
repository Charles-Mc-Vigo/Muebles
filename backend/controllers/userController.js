const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const phoneNumberRegex = /^(09|\+639)\d{9}$/;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])/;

exports.SignUp = async (req, res) => {
  try {
    const { firstname, lastname, phoneNumber, streetAddress, municipality, email, password, confirmPassword } = req.body;

    // Check if all fields are provided
    if (!firstname || !lastname || !phoneNumber || !streetAddress || !municipality || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingUser = await User.findOne({$or:[{email},{phoneNumber}]});
    if(existingUser){
      return res.status(200).json({message:"Account or phone number is  already existing"})
    }

    if(!phoneNumberRegex.test(phoneNumber)){
      return res.status(400).json({ message: "Invalid phone number!" });
    }

    if(!emailRegex.test(email)){
      return res.status(400).json({ message: "Invalid email account!" });
    }

    if(!passwordRegex.test(password)){
      return res.status(400).json({ message: "Passwords should contains at least one speacial character!" });
    }
    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    //hashed password
    const hashedPassword = await bcrypt.hash(password,10);
    // Create a new user without confirmPassword
    const newUser = new User({ firstname, lastname, phoneNumber, streetAddress, municipality, email, password:hashedPassword });
    await newUser.save();

    // Respond with the newly created user
    res.status(201).json(newUser);
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
