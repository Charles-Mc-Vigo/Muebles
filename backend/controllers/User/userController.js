const User = require("../../models/User/userModel");
const Cart = require("../../models/Cart/cartModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const {
	UserSchemaValidator,
} = require("../../middlewares/JoiSchemaValidation");
const {
	sendVerificationEmail,
	generateVerificationCode,
	sendPasswordResetVerificationCode,
} = require("../../utils/EmailVerification");
const createToken = require("../../utils/tokenUtils");
const Furniture = require("../../models/Furniture/furnitureModel");
const Rating = require('../../models/Rating/ratingModel');

exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find(req.query);
		res.status(200).json(users);
	} catch (error) {
		console.error("Error fetching all the users: ", error);
		res.status(500).json({ error: "Server error!" });
	}
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
			zipCode,
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
			return res.status(400).json({ error: "All fields are required!" });
		}

		const existingUser = await User.findOne({
			$or: [{ email }, { phoneNumber }],
		});
		if (existingUser) {
			return res
				.status(400)
				.json({ error: "Account or phone number is already existing!" });
		}

		if (!validator.isMobilePhone(phoneNumber, "en-PH")) {
			return res.status(400).json({ error: "Invalid phone number!" });
		}

		if (!validator.isEmail(email)) {
			return res.status(400).json({ error: "Invalid email account!" });
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
			return res.status(400).json({ error: "Password is weak!" });
		}

		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords do not match!" });
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
			return res.status(400).json({ error: error.details[0].message });
		}
		const verificationCode = generateVerificationCode();
		const verificationCodeExpires = Date.now() + 15 * 60 * 1000;

		await sendVerificationEmail(email, verificationCode);

		const newUser = new User({
			firstname,
			lastname,
			gender,
			phoneNumber,
			email,
			agreeToTerms,
			password: hashedPassword,
			verificationCode,
			verificationCodeExpires,
		});

		newUser.addresses.push({
			streetAddress,
			municipality,
			barangay,
			zipCode,
			isDefault: true,
		});

		await newUser.save();
		console.log(newUser);
		res.status(201).json({
			success:
				"We’ve sent a verification email to your inbox. Please check your email to verify your account.",
			newUser,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error!" });
	}
};

exports.passwordReset = async (req, res) => {
	try {
		const { email } = req.body;

		// Check if the email exists in the database
		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ message: "Account not found!" });

		// Generate a verification code and set its expiration
		const verificationCode = generateVerificationCode();
		const verificationCodeExpires = Date.now() + 15 * 60 * 1000;

		// Send the verification code to the user's email
		await sendPasswordResetVerificationCode(email, verificationCode); // Use email instead of userEmail

		// Add properties dynamically to the user object
		user.verificationCode = verificationCode;
		user.verificationCodeExpires = verificationCodeExpires;

		// Save the updated user object
		await user.save();

		// Send a success response
		res.status(200).json({
			message:
				"We've sent you a verification code for your password reset. Please check your email.",
			user,
		});
	} catch (error) {
		console.error("Error in password reset: ", error);
		res.status(500).json({ message: "Server error!" });
	}
};

exports.getUserId = async (req, res) => {
	try {
		const { userId } = req.params;

		// Use findOne with the combined filters
		const user = await User.findById(userId);

		if (!user) return res.status(404).json({ message: "User not found!" });

		res.status(200).json(user);
	} catch (error) {
		console.error("Error fetching the user by ID:", error);
		res.status(500).json({ message: "Server error!" });
	}
};

exports.verifyPRCode = async (req, res) => {
	try {
		const { userId } = req.params;

		const user = await User.findById(userId);

		if (!user) return res.status(404).json({ message: "User not found!" });

		const email = user.email;

		const { code } = req.body;

		if (!email || !code) {
			res
				.status(400)
				.json({ message: "Email and Verification Code is required!" });
		}

		if (
			user.verificationCode !== code ||
			new Date(user.verificationCodeExpires) < new Date()
		) {
			return res
				.status(400)
				.json({ message: "Invalid or expired verification code!" });
		}

		user.pswdResetOk = true;
		user.verificationCode = undefined;
		user.verificationCodeExpires = undefined;

		await user.save();
		res.status(200).json({
			message: "Verification completed! Please proceed to password reset",
		});
	} catch (error) {
		console.error("Error in creating new password: ", error);
		res.status(500).json({ message: "Server error!" });
	}
};

exports.createNewPswd = async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User is not found!" });

		if (!user.pswdResetOk)
			return res
				.status(400)
				.json({ message: "Please verify your password-reset code" });

		const { newPassword, confirmNewPassword } = req.body;

		if (!newPassword || !confirmNewPassword)
			return res
				.status(400)
				.json({ message: "New password and confirm password is required!" });

		if (
			!validator.isStrongPassword(newPassword, {
				minLength: 8,
				minLowercase: 1,
				minUppercase: 1,
				minNumbers: 1,
				minSymbols: 1,
			})
		) {
			return res.status(400).json({ message: "Password is weak!" });
		}

		if (newPassword !== confirmNewPassword) {
			return res.status(400).json({ message: "Passwords do not match!" });
		}

		const hashedNewPassword = await bcrypt.hash(newPassword, 10);

		user.password = hashedNewPassword;
		user.pswdResetOk = undefined;

		await user.save();
		res
			.status(200)
			.json({ message: "You have successfully created a new password!", user });
	} catch (error) {
		console.error("Error in creating new password: ", error);
		res.status(500).json({ message: "Server error!" });
	}
};

exports.unconfirmedUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await User.findById(userId);

		if (!user) return res.status(404).json({ message: "User not found!" });

		res.status(200).json(user);
	} catch (error) {
		console.error("Unconfirmed user error: ", error);
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
		user.role = "User";
		user.isActive = true;
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

		res
			.status(200)
			.json(
				{ message: "A new verification code has been sent to your email." },
				user
			);
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
			return res.status(404).json({ error: "Incorrect email account! Please ensure account was registered or sign up first!" });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({ error: "Incorrect password!" });
		}

		const token = createToken(user._id);

		res.cookie("authToken", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "strict",
		});

		user.isActive = true;
		await user.save();
		console.log(user);

		res.status(200).json({ success: "Login successful!" });
	} catch (error) {
		console.error("Login error: ", error.message);
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

		user.isActive = false;

		await user.save();
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

exports.UpdateUserInformation = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) return res.status(404).json({ message: "User not found!" });

		const updates = {};
		// Update fields if they are provided in the request body
		if (req.body.firstname && req.body.firstname !== user.firstname)
			updates.firstname = req.body.firstname;
		if (req.body.lastname && req.body.lastname !== user.lastname)
			updates.lastname = req.body.lastname;
		if (req.body.gender && req.body.gender !== user.gender)
			updates.gender = req.body.gender;
		if (req.body.phoneNumber && req.body.phoneNumber !== user.phoneNumber)
			updates.phoneNumber = req.body.phoneNumber;
		if (req.body.streetAddress && req.body.streetAddress !== user.streetAddress)
			updates.streetAddress = req.body.streetAddress;
		if (req.body.municipality && req.body.municipality !== user.municipality)
			updates.municipality = req.body.municipality;
		if (req.body.barangay && req.body.barangay !== user.barangay)
			updates.barangay = req.body.barangay;
		if (req.body.zipCode && req.body.zipCode !== user.zipCode)
			updates.zipCode = req.body.zipCode;
		if (req.body.email && req.body.email !== user.email)
			updates.email = req.body.email;

		// Handle image URL if provided and different from current
		if (req.body.image && req.body.image !== user.image) {
			updates.image = req.body.image;
		}

		// Handle uploaded image file (convert to base64 and compare)
		if (req.file) {
			const imageBuffer = req.file.buffer; // Get the file buffer
			const imageBase64 = imageBuffer.toString("base64"); // Convert to base64
			const mimeType = req.file.mimetype;
			const base64Image = `data:${mimeType};base64,${imageBase64}`;

			if (base64Image !== user.image) {
				updates.image = base64Image;
			}
		}

		// Check if there are no changes
		if (Object.keys(updates).length === 0) {
			return res
				.status(400)
				.json({ message: "No changes made to user information" });
		}

		// Update the user in the database
		await User.findByIdAndUpdate(user, updates, { new: true });

		return res.status(200).json({
			message: "User information updated successfully",
			user: updates,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "An error occurred while updating user information",
			error,
		});
	}
};

exports.ViewProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		if (!user) return res.status(404).json({ message: "User not found!" });

		res.status(200).json(user);
	} catch (error) {
		console.error("Error in viewwing profile: ", error);
		res.status(500).json({ message: "Server error!" });
	}
};

exports.userData = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		if (!user) return res.status(404).json({ message: "User not found!" });

		res.status(200).json(user);
	} catch (error) {
		console.error("Error in viewwing profile: ", error);
		res.status(500).json({ message: "Server error!" });
	}
};

exports.AddNewAddress = async (req, res) => {
	try {
		const { streetAddress, municipality, barangay, zipCode } = req.body;

		if (!streetAddress || !municipality || !barangay || zipCode === undefined) {
			return res.status(400).json({ error: "All fields are required." });
		}

		const userId = req.user._id;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}

		const newAddress = {
			streetAddress,
			municipality,
			barangay,
			zipCode,
		};

		user.addresses.push(newAddress);

		await user.save();

		res.status(201).json({
			success: "Address added successfully!",
			addresses: user.addresses,
		});
	} catch (error) {
		console.error("Error adding new address: ", error);
		res.status(500).json({ error: "Server error!" });
	}
};

exports.updateAddress = async (req, res) => {
	const { addressId } = req.params;
	const { municipality, barangay, streetAddress, zipCode, isDefault } =
		req.body;
	const userId = req.user._id;

	try {
		// Find the user
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found!" });

		// Find the address to update
		const address = user.addresses.id(addressId);
		if (!address)
			return res.status(404).json({ message: "Address not found!" });

		// Update the address fields
		address.municipality = municipality || address.municipality;
		address.barangay = barangay || address.barangay;
		address.streetAddress = streetAddress || address.streetAddress;
		address.zipCode = zipCode || address.zipCode;

		if (isDefault) {
			user.addresses.forEach((address) => {
				address.isDefault = false;
			});
			address.isDefault = true;
		}

		// Save the user
		await user.save();
		res.status(200).json(user);
	} catch (error) {
		console.error("Error updating address: ", error);
		res.status(500).json({ message: "Server error!" });
	}
};

exports.GetUserAddresses = async (req, res) => {
	try {
		const userId = req.user._id;

		const user = await User.findById(userId).select("addresses");
		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}

		res.status(200).json({
			success: true,
			addresses: user.addresses || [],
		});
	} catch (error) {
		console.error("Error fetching user addresses: ", error);
		res.status(500).json({ error: "Server error!" });
	}
};

exports.setToDefault = async (req, res) => {
	try {
		const { addressId } = req.params;
		const user = await User.findById(req.user._id);
		if (!user) return res.status(404).json({ message: "User not found!" });

		const address = user.addresses.id(addressId);
		if (!address)
			return res.status(404).json({ message: "Address not found!" });

		const defaultAddress = address.isDefault;
		console.log(defaultAddress)
		
		if (!defaultAddress) {
			user.addresses.forEach((address) => {
				address.isDefault = false;
			});
			address.isDefault = true;
		}
		// Save the user
		await user.save();
		res.status(200).json(user);

	} catch (error) {
		console.error("Error setting address to default :", error);
		res.status(500).json({ message: "Server error!" });
	}
};
