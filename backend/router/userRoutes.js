const express = require("express");
const router = express.Router();
const { SignUp, getAllUsers, LogIn, getUserByID, editUserInfo, deleteUserbyID} = require("../controllers/userController");

// Sign up
// @route POST /api/user/signup
//create a user
router.post("/api/user/signup", SignUp);

// Get all users
// @route GET /api/users
//get all users
router.get("/api/users", getAllUsers);

// Login
// @route POST /api/user/login
//login user
router.post("/api/user/login", LogIn);

//get user by id
// @route GET /api/user/:id
router.get("/api/user/:id", getUserByID);


//edit user information
// @route PUT /api/user/:id
router.put("/api/user/:id", editUserInfo);

//edit user information
// @route PUT /api/user/:id
router.delete("/api/user/:id", deleteUserbyID);

module.exports = router;
