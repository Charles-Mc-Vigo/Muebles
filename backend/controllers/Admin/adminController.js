const Admin = require('../../models/Admin/adminModel');
const {AdminSchemaValidator} = require('../../middlewares/JoiSchemaValidation');
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const {
	sendVerificationEmail,
	generateVerificationCode,
} = require("../../utils/EmailVerification");
const createToken = require('../../utils/tokenUtils');

// Admin login
exports.AdminLogin = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Fetch admin by email
		const admin = await Admin.findOne({ email });
		if (!admin) {
			return res.status(404).json({ message: "Incorrect email account!" });
		}
		
		// Check for admin role
		if (!["Admin", "Manager"].includes(admin.role)) {
			return res.status(403).json({ message: "Access denied: Admins only!" });
		}

		// Validate password
		const isMatch = await bcrypt.compare(password, admin.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Incorrect password!" });
		}

	const token = createToken(admin._id);

		admin.isActive = true;
		await admin.save();

		// Set token in the response as a cookie
		res.cookie("adminToken", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production", // Use secure cookies in production
			maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
			sameSite: "strict",
		});

		// Send response
		return res.status(200).json({ message: "Login successful!"});

	} catch (error) {
		console.error("Error during admin login:", error);
		return res.status(500).json({ message: "Server error!" });
	}
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
			verificationCodeExpires
		});
		
		await newAdmin.save();
		res.status(201).json({  message: "Your account has been created successfully. Please check your email to verify your account.",newAdmin})
		// console.log("New admin created: ",newAdmin)

	} catch (error) {
		console.log(error);
		res.status(500).json({message:"Server Error"})
	}
}

exports.unconfirmedAdmin = async( req,res ) =>{
	try {
		const { adminId } = req.params;
    const admin = await Admin.findById(adminId);

    if (!admin) return res.status(404).json({ message: "Admin not found!" });

    res.status(200).json(admin);
	} catch (error) {
		console.log("Error the unconfirmed admin: ",error);
		res.status(500).json({message:"Server error!"});
	}
}

//admin account verification
exports.verifyEmail = async (req, res) => {
	try {
		const {adminId} = req.params;

		const admin = await Admin.findById(adminId);

		if(!admin) return res.status(404).json({message:"Admin not found!"});

		const email = admin.email;

		const { code } = req.body;

		if (!email || !code) {
			return res
				.status(400)
				.json({ message: "Email and verification code are required!" });
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

		res.status(200).json({ message: "Your account was successfully verified! However, the Admin Manager must first accept your request to proceed." });
	} catch (err) {
		console.error("Email verification error:",err);
		res.status(500).json({ message: "Server error!" });
	}
};

//get admin by id
//routes ("/admin/:adminId",getAdminById)
exports.getAdminById = async (req, res) => {
  try {
    const { adminId } = req.params;
    const admin = await Admin.findById(adminId);

    if (!admin) return res.status(404).json({ message: "Admin not found!" });

    res.status(200).json(admin);
		// console.log(admin)
  } catch (error) {
    console.log("Error fetching admin by id: ", error);
    res.status(500).json({ message: "Server error!" });
  }
};


// Manager power
exports.AcceptAdminRequest = async (req, res) => {
  try {
		const admin = await Admin.findById(req.admin._id);

		if(!admin) return res.status(404).json({message:"Admin not found!"});

    // Check if the current admin is a Manager
    if (admin.role !== "Manager") {
      return res.status(403).json({ message: "Action denied: Admin Manager only!" });
    }

    const { adminId } = req.params; // Get adminId from URL parameters

    // Fetch the admin who is requesting to be accepted
    const adminToAccept = await Admin.findById(adminId);
    if (!adminToAccept || adminToAccept.adminApproval === "Accepted") {
      return res.status(400).json({ message: "Admin already accepted or not found!" });
    }

    // Update the admin's approval and role
    adminToAccept.adminApproval = "Accepted";
    adminToAccept.role = "Admin";
    adminToAccept.isActive = true;

    // Create token after the admin is approved
    const token = createToken(adminToAccept._id);

    // Set token in the response as a cookie
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      sameSite: "strict",
    });

    await adminToAccept.save();

    res.status(200).json({ message: "Admin request accepted successfully!" });
  } catch (error) {
    console.error("Error accepting admin request:", error);
    res.status(500).json({ message: "Server error!" });
  }
};


//pending admin request
exports.PendingAdminRequest = async (req,res) => {
	try {
		const admins = await Admin.find({adminApproval:"Pending"});
		if(admins.length === 0) return res.status(400).json({message:"No admin request found!"});
		res.status(200).json(admins)
	} catch (error) {
		console.log("Error fetching pending admin request : ",error);
		res.status(500).json({message:"Server error!"});
	}
}

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


exports.adminLogout = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found!" });
    }

    // Clear the token from cookies
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    // Update admin status and save
    admin.isActive = false;
    await admin.save();

    return res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    console.error("Failed to log out admin:", error);
    return res.status(500).json({ message: "Server error!" });
  }
};


// Update profile
exports.updateProfile = async (req, res) => {
  try {
    // Find the admin by ID (adminId is now available from the middleware)
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found!" });
    }

    // Fields to be updated
    const { firstname, lastname, phoneNumber, gender } = req.body;
    let isChanged = false; // To track if any changes are made
    const updatedFields = {};

    // Compare each field with the current value and only add to updatedFields if they are different
    if (firstname && firstname !== admin.firstname) {
      updatedFields.firstname = firstname;
      isChanged = true;
    }
    if (lastname && lastname !== admin.lastname) {
      updatedFields.lastname = lastname;
      isChanged = true;
    }
    if (phoneNumber && phoneNumber !== admin.phoneNumber) {
      updatedFields.phoneNumber = phoneNumber;
      isChanged = true;
    }
    if (gender && gender !== admin.gender && ["Male", "Female"].includes(gender)) {
      updatedFields.gender = gender;
      isChanged = true;
    }

    // Handle image URL if provided and different from current
    if (req.body.image && req.body.image !== admin.image) {
      updatedFields.image = req.body.image;
      isChanged = true;
    }

    // Handle uploaded image file (convert to base64 and compare)
    if (req.file) {
      const imageBuffer = req.file.buffer; // Get the file buffer
      const imageBase64 = imageBuffer.toString('base64'); // Convert to base64
      const mimeType = req.file.mimetype;
      const base64Image = `data:${mimeType};base64,${imageBase64}`;

      if (base64Image !== admin.image) {
        updatedFields.image = base64Image;
        isChanged = true;
      }
    }

    // If no changes were made, return a message
    if (!isChanged) {
      return res.status(400).json({ message: "No changes made to the profile." });
    }

    // Update the admin document with the new fields
    const updatedAdmin = await Admin.findByIdAndUpdate(req.admin._id, updatedFields, { new: true });

    res.status(200).json({ message: "Profile updated successfully!", admin: updatedAdmin });
  } catch (error) {
    console.error("Error updating profile setting", error);
    res.status(500).json({ message: "Server error!" });
  }
};

//myprofile
exports.myProfile = async (req,res) => {
	try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found!" });
    }

		res.status(200).json(admin)
	} catch (error) {
		console.log("Error fetching my profile: ",error);
		res.status(500).json({message:"Server error!"})
	}
}

