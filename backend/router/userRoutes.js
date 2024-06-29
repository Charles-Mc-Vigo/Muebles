const express = require("express");
const router = express.Router();
const { SignUp, getAllUsers, LogIn } = require("../controllers/userController");

// Sign up
// @route POST /api/user/signup
router.post("/api/user/signup", SignUp);

// Get all users
// @route GET /api/users
router.get("/api/users", getAllUsers);

// Login
// @route POST /api/user/login
router.post("/api/user/login", LogIn);

module.exports = router;
