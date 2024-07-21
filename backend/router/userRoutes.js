const express = require("express");
const router = express.Router();
const { SignUp, getAllUsers, LogIn, getUserByID, editUserInfo, deleteUserbyID, getUserRoles} = require("../controllers/userController");
const authRoutes = require("../middlewares/authRoutes");


// Sign up
// @route POST /api/user/signup
//create a user
router.post("/signup", SignUp);

// Login
// @route POST /api/user/login
//login user
router.post("/login", LogIn);

// Get all users
// @route GET /api/users
//get all users
router.use(authRoutes)
router.get("/", getAllUsers);

//get user by id
// @route GET /api/users/:id
router.get("/:id", getUserByID);

//get all user roles
// @route GET /api/users/roles
router.get("/manageRoles/roles", getUserRoles);

//edit user information
// @route PUT /api/users/:id
router.put("/:id", editUserInfo);

//edit user information
// @route PUT /api/users/:id
router.delete("/:id", deleteUserbyID);

module.exports = router;
