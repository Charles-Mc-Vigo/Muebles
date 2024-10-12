const User = require("../../models/User/userModel");
const Furniture = require("../../models/Furniture/furnitureModel");
const Cart = require("../../models/Cart/cartModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validator = require("validator");
const {
	UserSchemaValidator,
} = require("../../middlewares/JoiSchemaValidation");
const jwt = require("jsonwebtoken");
const {
	sendVerificationEmail,
	generateVerificationCode,
} = require("../../utils/EmailVerification");

//task
//user could,login, signup, request account deletion, request password reset, view products, add to cart, make payment, direct order, view order or purchase, view purchase history

//token for creation of user and logging in their account
const createToken = (_id) => {
	return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

//sign up and some validation
exports.SignUp = async (req, res) => {
	try {
		const {
			firstname,
			lastname,
			gender,
			phoneNumber,
			streetAddress,
			municipality,
			barangay,
			email,
			agreeToTerms,
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
			!barangay ||
			!email ||
			!password ||
			!confirmPassword ||
			!agreeToTerms
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
			barangay,
			email,
			agreeToTerms,
			password: hashedPassword,
			verificationCode,
			verificationCodeExpires,
		});

		await newUser.save();
		res.status(201).json(newUser);
		// res.send("We’ve sent a verification email to your inbox. Please check your email to verify your account."); //this causing trouble, kailangan kita icomment haha
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error!" });
	}
};

//for verifying user account
exports.verifyEmail = async (req, res) => {
	try {
		const { userId } = req.params;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found!" });
		}

		const email = user.email;

		const { code } = req.body;

		if (!email || !code) {
			return res
				.status(400)
				.json({ message: "Email and verification code are required!" });
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
			sameSite: "strict",
			maxAge: 3 * 24 * 60 * 60 * 1000,
		});
		// console.log(token);

		res.status(200).json({ message: "Email verified successfully!", token });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error!" });
	}
};

//resend verification
exports.resendVerificationCode = async (req, res) => {
	try {
			const { userId } = req.params; // Assuming userId is passed as a URL parameter
			const user = await User.findById(userId);
			
			if (!user) {
					return res.status(404).json({ message: "User not found!" });
			}

			// Check if the user is already verified
			if (user.isVerified) {
					return res.status(400).json({ message: "User is already verified!" });
			}

			// Generate a new verification code
			const verificationCode = generateVerificationCode();
			const verificationCodeExpires = Date.now() + 15 * 60 * 1000; // 15 minutes from now

			// Send the verification email
			await sendVerificationEmail(user.email, verificationCode);

			// Update the user's verification code and expiration
			user.verificationCode = verificationCode;
			user.verificationCodeExpires = verificationCodeExpires;
			await user.save();

			res.status(200).json({ message: "A new verification code has been sent to your email." },user);

	} catch (error) {
			console.log("Error resending Verification code: ", error);
			res.status(500).json({ message: "Server error!" });
	}
};

//get user by id
exports.getUserById = async(req,res) =>{
	try {
		const {userId} = req.params;
		const user = await User.findById(userId);

		if(!user) return res.status(404).json({message: "User not found!"})
		
			res.status(200).json(user)
	} catch (error) {
		console.log("Error fetching the user by its id: ",error);
		res.status(500).json({message:"Server error!"})
	}
}//get user by id

exports.GetAllUsers = async(req,res) =>{
	try {
		const users = await User.find();

		if(users.length === 0) return res.status(404).json({message: "No users found!"})
		
			res.status(200).json(users)
	} catch (error) {
		console.log("Error fetching users : ",error);
		res.status(500).json({message:"Server error!"})
	}
}

//login
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

		res.status(200).json({ message: "Login successful!", token });
	} catch (error) {
		res.status(500).json({ message: "Server error!" });
	}
};

//view all furnitures
exports.viewFurnitures = async (req, res) => {
	try {
		const furnitures = await Furniture.find(req.query);

		if (furnitures.length === 0) {
			return res.status(404).json({ message: "No furniture found!" });
		}
		res.status(200).json(furnitures);
	} catch (error) {
		console.log("Failed to view products:", error);
		res.status(500).json({ message: "Server error!" });
	}
};

//logout
exports.Logout = async (req, res) => {
	try {
		const userId = req.user._id;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found!" });
		}

		res.clearCookie("authToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});

		res.status(200).json({ message: "Logout successful!" });
		console.log("Logout successful!");
	} catch (error) {
		res.status(500).json({ message: "Server error!" });
		console.error("Failed to log out:", error);
	}
};

//view cart
exports.viewCart = async (req, res) => {
	try {
		const userId = req.user._id;
		const userCart = await Cart.findOne({ user: userId });
		res.status(200).json(userCart);
	} catch (error) {
		console.log("Failed to view cart", error);
		res.status(500).json({ message: "Server error!" });
	}
};

exports.addToCart = async (req, res) => {
	//task here
};


// 		const { id } = req.params;
// 		const user = await User.findById(id);

// 		if (!user) {
// 			return res.status(404).json({ message: "User not found!" });
// 		}

// 		res.status(200).json(user);
// 	} catch (error) {
// 		res.status(400).json({ message: error.message });
// 		console.log(error);
// 	}
// };

// exports.showAdmins = async (req, res) => {
// 	try {
// 		const users = await User.find({}, "firstname lastname email isAdmin");

// 		if (!users.length) {
// 			return res.status(404).json({ message: "No users found!" });
// 		}
// 		res.status(200).json(users);
// 	} catch (error) {
// 		res.status(400).json({ message: error.message });
// 		console.log(error);
// 	}
// };

// exports.editUserInfo = async (req, res) => {
// 	try {
// 		const { id } = req.params;
// 		const {
// 			firstname,
// 			lastname,
// 			gender,
// 			phoneNumber,
// 			streetAddress,
// 			municipality,
// 			email,
// 			role,
// 		} = req.body;

// 		const existingUser = await User.findById(id);
// 		if (!existingUser) {
// 			return res.status(404).json({ message: "User not found!" });
// 		}

// 		if (email && !validator.isEmail(email)) {
// 			return res.status(400).json({ message: "Invalid email address!" });
// 		}

// 		if (phoneNumber && !validator.isMobilePhone(phoneNumber, "en-PH")) {
// 			return res.status(400).json({ message: "Invalid phone number!" });
// 		}

// 		if (firstname) existingUser.firstname = firstname;
// 		if (lastname) existingUser.lastname = lastname;
// 		if (gender) existingUser.gender = gender;
// 		if (phoneNumber) existingUser.phoneNumber = phoneNumber;
// 		if (streetAddress) existingUser.streetAddress = streetAddress;
// 		if (municipality) existingUser.municipality = municipality;
// 		if (email) existingUser.email = email;
// 		if (role) existingUser.role = role;

// 		existingUser.updatedAt = new Date();

// 		const { error } = UserSchemaValidator.validate({
// 			firstname: existingUser.firstname,
// 			lastname: existingUser.lastname,
// 			gender: existingUser.gender,
// 			streetAddress: existingUser.streetAddress,
// 			municipality: existingUser.municipality,
// 			password: existingUser.password,
// 		});
// 		if (error) {
// 			return res.status(400).json({ message: error.details[0].message });
// 		}

// 		const modifiedUser = await existingUser.save();

// 		res
// 			.status(200)
// 			.json({
// 				message: "User information updated successfully!",
// 				user: modifiedUser,
// 			});
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ message: "Server error!" });
// 	}
// };

// exports.deleteUserbyID = async (req, res) => {
// 	try {
// 		const {id} = req.params
// 		const user = await User.findByIdAndDelete(id);
// 		if (!user) {
// 			return res.status(404).json({ message: "User not found!" });
// 		}

// 		res.status(200).json({ message: "User has been deleted!", user });
// 	} catch (error) {
// 		console.error("Failed to delete the user:",error);
// 		res.status(500).json({ message: "Server error!" });
// 	}
// };
