const express = require("express");
const router = express.Router();
const {
  SignUp,
  LogIn,
  Logout,
  verifyEmail,
  viewFurnitures,
  viewCart,
  addToCart
} = require("../controllers/userController");

const authRoutes = require("../middlewares/authRoutes");
// Public Routes
router.post("/signup", SignUp);  // Sign up
router.post('/verify-email', verifyEmail);
router.post("/login", LogIn);    // Log in


// Routes accessible to all authenticated users
router.use(authRoutes);

router.get("/view-furnitures",viewFurnitures)
router.get("/cart/view-cart",viewCart)
router.post("/cart/add-to-cart",addToCart)
router.post("/logout", Logout);           // Log out

// // Admin-Only Routes
// router.use(adminOnly);

// router.delete("/delete-user/:id", deleteUserbyID);         // Delete a user by ID (Admin only)
// router.post("/logout", Logout);         // Logout Admin


module.exports = router;
