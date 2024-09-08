const express = require("express");
const router = express.Router();
const {
  SignUp,
  getAllUsers,
  LogIn,
  getUserByID,
  editUserInfo,
  deleteUserbyID,
  Logout,
  verifyEmail
} = require("../controllers/userController");

const authRoutes = require("../middlewares/authRoutes");
const adminOnly = require("../middlewares/adminOnly");

// Public Routes
router.post("/signup", SignUp);  // Sign up
router.post('/verify-email', verifyEmail);
router.post("/login", LogIn);    // Log in


// Routes accessible to all authenticated users
router.use(authRoutes);

router.get("/profile/:id", getUserByID);  // View user profile
router.put("/profile/:id", editUserInfo); // Edit own profile
router.post("/profile/logout", Logout);           // Log out

// Admin-Only Routes
router.use(adminOnly);

router.get("/", getAllUsers);                  // Get all users (Admin only)
router.delete("/delete-user/:id", deleteUserbyID);         // Delete a user by ID (Admin only)
router.post("/logout", Logout);         // Logout Admin


module.exports = router;
