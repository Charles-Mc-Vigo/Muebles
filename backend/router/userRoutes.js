const express = require("express");
const router = express.Router();
const { SignUp, getAllUsers, LogIn, getUserByID, editUserInfo, deleteUserbyID} = require("../controllers/userController");

// Sign up
// @route POST /api/user/signup
//create a user
router.post("/signup", SignUp);

// Get all users
// @route GET /api/users
//get all users
router.get("/", getAllUsers);

// Login
// @route POST /api/user/login
//login user
router.post("/login", LogIn);

//get user by id
// @route GET /api/user/:id
router.get("/:id", getUserByID);


//edit user information
// @route PUT /api/user/:id
router.put("/:id", editUserInfo);

//edit user information
// @route PUT /api/user/:id
router.delete("/:id", deleteUserbyID);

module.exports = router;
