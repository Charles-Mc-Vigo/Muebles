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
const createToken = require('../../utils/tokenUtils');
//task
//user could,login, signup, request account deletion, request password reset, view products, add to cart, make payment, direct order, view order or purchase, view purchase history



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
			verificationCodeExpires
		});

		await newUser.save();
		console.log(newUser)
		res.status(201).json({message:"We’ve sent a verification email to your inbox. Please check your email to verify your account.", newUser});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error!" });
	}
};

exports.unconfirmedUser = async (req,res) => {
	try {
	const {userId} = req.params;
	const user = await User.findById(userId);

	if(!user) return res.status(404).json({message:"User not found!"});
		
	res.status(200).json(user);
	} catch (error) {
		console.error("Unconfirmed user error: ",error);
		res.status(500).json({message:"Server error!"});
	}
}

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
		user.role = "User";
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

		res.status(200).json({ message: "Signed up successfully!" });
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

			res.status(200).json({ message: "A new verification code has been sent to your email." }, user);

	} catch (error) {
			console.log("Error resending Verification code: ", error);
			res.status(500).json({ message: "Server error!" });
	}
};

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

//logout
exports.Logout = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId)

		if (!user) {
			return res.status(404).json({ message: "User not found!" });
		}
		if(user.isActive){
			return res.status(400).json({message:"This user is currently online"});
		}

		res.clearCookie("authToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});
		
		user.isActive = false;
		await user.save();

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


exports.UpdateUserInformation = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize an updates object
    const updates = {};

    // Update fields if they are provided in the request body
    if (req.body.firstname && req.body.firstname !== user.firstname) updates.firstname = req.body.firstname;
    if (req.body.lastname && req.body.lastname !== user.lastname) updates.lastname = req.body.lastname;
    if (req.body.gender && req.body.gender !== user.gender) updates.gender = req.body.gender;
    if (req.body.phoneNumber && req.body.phoneNumber !== user.phoneNumber) updates.phoneNumber = req.body.phoneNumber;
    if (req.body.streetAddress && req.body.streetAddress !== user.streetAddress) updates.streetAddress = req.body.streetAddress;
    if (req.body.municipality && req.body.municipality !== user.municipality) updates.municipality = req.body.municipality;
    if (req.body.barangay && req.body.barangay !== user.barangay) updates.barangay = req.body.barangay;
    if (req.body.zipCode && req.body.zipCode !== user.zipCode) updates.zipCode = req.body.zipCode;
    if (req.body.email && req.body.email !== user.email) updates.email = req.body.email;

    // Handle image upload from a file
    if (req.file) {
      const imageBuffer = req.file.buffer; // Assuming you're using multer
      const base64Image = imageBuffer.toString('base64');
      updates.image = `data:${req.file.mimetype};base64,${base64Image}`;
    }

    // Handle image URL
    if (req.body.image) {
      updates.image = req.body.image; // Set the image to the provided URL
    }

    // Check if there are no changes
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No changes made to user information' });
    }

    // Update the user in the database
    await User.findByIdAndUpdate(userId, updates, { new: true });

    return res.status(200).json({ message: 'User information updated successfully', user: updates });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while updating user information', error });
  }
};