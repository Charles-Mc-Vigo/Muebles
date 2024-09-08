const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { UserSchemaValidator } = require("../middlewares/JoiSchemaValidation");
const jwt = require("jsonwebtoken");
const {
	sendVerificationEmail,
	generateVerificationCode,
} = require("../utils/EmailVerification");

const createToken = (_id) => {
	return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

exports.SignUp = async (req, res) => {
	try {
		const {
			firstname,
			lastname,
			gender,
			phoneNumber,
			streetAddress,
			municipality,
			email,
			password,
			confirmPassword,
		} = req.body;

		if (
			!firstname ||
			!lastname ||
			!gender ||
			!phoneNumber ||
			!streetAddress ||
			!municipality ||
			!email ||
			!password ||
			!confirmPassword
		) {
			return res.status(400).json({ message: "All fields are required!" });
		}

		const existingUser = await User.findOne({
			$or: [{ email }, { phoneNumber }],
		});
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "Account or phone number is already existing!" });
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

		const { error } = UserSchemaValidator.validate({
			firstname,
			lastname,
			gender,
			streetAddress,
			municipality,
			password,
		});
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}
		const verificationCode = generateVerificationCode();
		const verificationCodeExpires = Date.now() + 15 * 60 * 1000;

		await sendVerificationEmail(email, verificationCode);

		const newUser = new User({
			firstname,
			lastname,
			gender,
			phoneNumber,
			streetAddress,
			municipality,
			email,
			password: hashedPassword,
			verificationCode,
			verificationCodeExpires,
		});

		await newUser.save();
		// const token = createToken(newUser._id);

		// res.cookie('authToken', token, {
		//   httpOnly: true,
		//   secure: process.env.NODE_ENV === 'production',
		//   maxAge: 3 * 24 * 60 * 60 * 1000,
		//   sameSite: 'strict'
		// });

		res.status(201).json({ message: "Account created successfully!" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error!" });
	}
};

exports.verifyEmail = async (req, res) => {
	try {
		const { email, code } = req.body;

		if (!email || !code) {
			return res
				.status(400)
				.json({ message: "Email and verification code are required!" });
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ message: "User not found!" });
		}

		if (
			user.verificationCode !== code ||
			new Date(user.verificationCodeExpires) < new Date()
		) {
			return res
				.status(400)
				.json({ message: "Invalid or expired verification code!" });
		}

		user.isVerified = true;
		user.verificationCode = undefined;
		user.verificationCodeExpires = undefined;

		await user.save();

		const token = createToken(user._id);

		res.cookie("authToken", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 3 * 24 * 60 * 60 * 1000,
		});
		// console.log(token);

		res.status(200).json({ message: "Email verified successfully!", token });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error!" });
	}
};

exports.LogIn = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "Incorrect email account!" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Incorrect password!" });
		}

		const token = createToken(user._id);

		res.cookie("authToken", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "strict",
		});

		res
			.status(200)
			.json({ message: "Login successful!", token });
	} catch (error) {
		res.status(500).json({ message: "Server error!" });
	}
};

//Admin Sign up here

exports.AdminLogin = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "Incorrect email account!" });
		}

		if (user.role !== "Admin") {
			return res.status(403).json({ message: "Access denied: Admins only!" });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({ message: "Incorrect password!" });
		}

		const token = createToken(user._id);

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

exports.Logout = async (req, res) => {
	try {
		const userId = req.user._id;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found!" });
		}

		if (user.role === "Admin") {
			res.clearCookie("adminToken", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
			});
		} else {
			res.clearCookie("authToken", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
			});
		}

		res.status(200).json({ message: "Logout successful!" });
		console.log("Logout successful!");
	} catch (error) {
		res.status(500).json({ message: "Server error!" });
		console.error(error);
	}
};

exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error!" });
	}
};

exports.getUserByID = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);

		if (!user) {
			return res.status(404).json({ message: "User not found!" });
		}

		res.status(200).json(user);
	} catch (error) {
		res.status(400).json({ message: error.message });
		console.log(error);
	}
};

exports.showAdmins = async (req, res) => {
	try {
		const users = await User.find({}, "firstname lastname email isAdmin");

		if (!users.length) {
			return res.status(404).json({ message: "No users found!" });
		}
		res.status(200).json(users);
	} catch (error) {
		res.status(400).json({ message: error.message });
		console.log(error);
	}
};

exports.editUserInfo = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			firstname,
			lastname,
			gender,
			phoneNumber,
			streetAddress,
			municipality,
			email,
			role,
		} = req.body;

		const existingUser = await User.findById(id);
		if (!existingUser) {
			return res.status(404).json({ message: "User not found!" });
		}

		if (email && !validator.isEmail(email)) {
			return res.status(400).json({ message: "Invalid email address!" });
		}

		if (phoneNumber && !validator.isMobilePhone(phoneNumber, "en-PH")) {
			return res.status(400).json({ message: "Invalid phone number!" });
		}

		if (firstname) existingUser.firstname = firstname;
		if (lastname) existingUser.lastname = lastname;
		if (gender) existingUser.gender = gender;
		if (phoneNumber) existingUser.phoneNumber = phoneNumber;
		if (streetAddress) existingUser.streetAddress = streetAddress;
		if (municipality) existingUser.municipality = municipality;
		if (email) existingUser.email = email;
		if (role) existingUser.role = role;

		existingUser.updatedAt = new Date();

		const { error } = UserSchemaValidator.validate({
			firstname: existingUser.firstname,
			lastname: existingUser.lastname,
			gender: existingUser.gender,
			streetAddress: existingUser.streetAddress,
			municipality: existingUser.municipality,
			password: existingUser.password,
		});
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}

		const modifiedUser = await existingUser.save();

		res
			.status(200)
			.json({
				message: "User information updated successfully!",
				user: modifiedUser,
			});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error!" });
	}
};

exports.deleteUserbyID = async (req, res) => {
	try {
		const { id } = req.params;

		const existingUser = await User.findById(id);
		if (!existingUser) {
			return res.status(404).json({ message: "User not found!" });
		}

		const user = await existingUser.deleteOne();
		res.status(200).json({ message: "User has been deleted!", user });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error!" });
	}
};
