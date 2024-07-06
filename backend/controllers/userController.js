const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const {UserSchemaValidator} = require("../middlewares/UserSchemaValidator");

//POST - /api/user/signup
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

    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
      return res.status(400).json({ message: "Password is weak!" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = UserSchemaValidator.validate({firstname,lastname,streetAddress,municipality, password});
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newUser = new User({ firstname, lastname, phoneNumber, streetAddress, municipality, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({message:"Account created successfully!",newUser:newUser});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


//POST - /api/user/login
exports.LogIn = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(!user){
      return res.status(404).json({message:"Incorrect email account"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    res.status(200).json({message:"Login successful"})
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//GET - /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//GET - /api/user/:id
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

//PUT - /api/user/:id
exports.editUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, phoneNumber, streetAddress, municipality, email } = req.body;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address!" });
    }

    if (phoneNumber && !validator.isMobilePhone(phoneNumber, "en-PH")) {
      return res.status(400).json({ message: "Invalid phone number!" });
    }

    if (firstname) existingUser.firstname = firstname;
    if (lastname) existingUser.lastname = lastname;
    if (phoneNumber) existingUser.phoneNumber = phoneNumber;
    if (streetAddress) existingUser.streetAddress = streetAddress;
    if (municipality) existingUser.municipality = municipality;
    if (email) existingUser.email = email;

    existingUser.updatedAt = new Date();

    const { error } = JoiSchemaValidator.validate({
      firstname: existingUser.firstname,
      lastname: existingUser.lastname,
      streetAddress: existingUser.streetAddress,
      municipality: existingUser.municipality,
      password: existingUser.password
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const modifiedUser = await existingUser.save();

    res.status(200).json({ message: "User information updated successfully!", user: modifiedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//delete request
//DELETE - /api/user/:id
exports.deleteUserbyID = async (req,res) => {
  try {
    const {id} = req.params;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await existingUser.deleteOne();
    res.status(200).json({message:"User has been deleted",existingUser})
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

