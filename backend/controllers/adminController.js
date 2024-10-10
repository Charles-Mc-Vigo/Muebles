const Admin = require('../models/adminModel');
const User = require('../models/User/userModel');
const {AdminSchemaValidator} = require('../middlewares/JoiSchemaValidation');
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const {
	sendVerificationEmail,
	generateVerificationCode,
} = require("../utils/EmailVerification");

//create token with the combination of id and secrets followed by the expiration date
const createToken = (_id) => {
	return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

//Admin Sign up here
exports.AdminSignup = async (req,res) =>{
	try {
		const {firstname,lastname,gender,phoneNumber,email,password, confirmPassword} = req.body;

		if(!firstname || !lastname || !gender || !phoneNumber || !email || !password || !confirmPassword){
			return res.status(400).json({ message: "All fields are required!" });
		}

		const exisitingAdmin = await Admin.findOne({$or: [{ email }, { phoneNumber }]});
		if(exisitingAdmin){
			return res.status(400).json({message:"Your email or number is already exisiting. Please login your account!"})
		}

		if (!validator.isMobilePhone(phoneNumber, "en-PH")) {
			return res.status(400).json({ message: "Invalid phone number!" });
		}

		if (!validator.isEmail(email)) {
			return res.status(400).json({ message: "Invalid email account!" });
		}

		if (
			!validator.isStrongPassword(password, {
				minLength: 8,
				minLowercase: 1,
				minUppercase: 1,
				minNumbers: 1,
				minSymbols: 1,
			})
		) {
			return res.status(400).json({ message: "Password is weak!" });
		}

		if (password !== confirmPassword) {
			return res.status(400).json({ message: "Passwords do not match!" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const { error } = AdminSchemaValidator.validate({
			firstname,
			lastname,
			gender,
			password
		});

		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}
		const verificationCode = generateVerificationCode();
		const verificationCodeExpires = Date.now() + 15 * 60 * 1000;

		await sendVerificationEmail(email, verificationCode);

		const newAdmin = new Admin({
			firstname,
			lastname,
			gender,
			phoneNumber,
			email,
			password: hashedPassword,
			verificationCode,
			verificationCodeExpires,
		});

		await newAdmin.save();
		res.status(201).json({ message: "We’ve sent a verification email to your inbox. Please check your email to verify your admin account." 
		});

	} catch (error) {
		console.log(error);
		res.status(500).json({message:"Server Error"})
	}
}

//admin login
exports.AdminLogin = async (req, res) => {
	try {
		const { email, password } = req.body;

		const admin = await Admin.findOne({ email });

		if (!admin) {
			return res.status(404).json({ message: "Incorrect email account!" });
		}

		if (admin.role !== "Admin") {
			return res.status(403).json({ message: "Access denied: Admins only!" });
		}

		const isMatch = await bcrypt.compare(password, admin.password);

		if (!isMatch) {
			return res.status(400).json({ message: "Incorrect password!" });
		}

		const token = createToken(admin._id);

		res.cookie("adminToken", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "strict",
		});

		res
			.status(200)
			.json({ message: "Successfully logged in as an Admin!", token });
	} catch (error) {
		res.status(500).json({ message: "Server error!" });
		console.error(error);
	}
};

//admin account verification
exports.verifyEmail = async (req, res) => {
	try {
		const { email, code } = req.body;

		if (!email || !code) {
			return res
				.status(400)
				.json({ message: "Email and verification code are required!" });
		}

		const admin = await Admin.findOne({ email });

		if (!admin) {
			return res.status(400).json({ message: "Admin not found!" });
		}

		if (
			admin.verificationCode !== code ||
			new Date(admin.verificationCodeExpires) < new Date()
		) {
			return res
				.status(400)
				.json({ message: "Invalid or expired verification code!" });
		}

		admin.isVerified = true;
		admin.verificationCode = undefined;
		admin.verificationCodeExpires = undefined;

		await admin.save();

		const token = createToken(admin._id);

		res.cookie("adminToken", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 3 * 24 * 60 * 60 * 1000,
		});
		// console.log(token);

		res.status(200).json({ message: "Admin account was verified successfully!", token });
	} catch (err) {
		console.error("Email verification error:",err);
		res.status(500).json({ message: "Server error!" });
	}
};

//get all admins
exports.AllAdmins = async(req,res)=>{
	try {
		//get admin by id query
		const {id} = req.query;
		if(id){
			const admin = await Admin.findById(id);
			if(!admin){
				return res.status(404).json({message:"Admin not found!"})
			}
			return res.status(200).json(admin)
		}

		//get All admin
		const admins = await Admin.find();
		if(admins.length === 0){
			return res.status(404).json({message:"No admins found!"})
		}
		res.status(200).json(admins)
	} catch (error) {
		console.log(error);
		res.status(500).json({message:"Server error!"})
	}
}

//get all user
//get users by id using quiery
exports.getUsers = async (req, res) => {
	try {
		//get specific user by id
		const {id} = req.query;

		if(id){
			const user = await User.findById(id);

			if(!user){
				return res.status(404).json({message:"User not found!"})
			}
		}
		//get all users
		const users = await User.find();
		if(users.length === 0){
			return res.status(404).json({message:"No users found!"})
		}
		res.status(200).json(users);
	} catch (err) {
		console.error("Failed to fetch user data:",err);
		res.status(500).json({ message: "Server error!" });
	}
};


exports.adminLogout = async (req, res) => {
	try {
		const adminId = req.user._id;

		const admin = await Admin.findById(adminId);

		if (!admin) {
			return res.status(404).json({ message: "Admin not found!" });
		}

		res.clearCookie("adminToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict"
		});

		res.status(200).json({ message: "Admin: Logout successful!" });
		console.log("Admin: Logout successful!");
	} catch (error) {
		res.status(500).json({ message: "Server error!" });
		console.error("Failed to Admin: log out:",error);
	}
};