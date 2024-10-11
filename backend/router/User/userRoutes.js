const express = require("express");
const router = express.Router();
const {
  SignUp,
  LogIn,
  Logout,
  verifyEmail,
  viewFurnitures,
  viewCart,
  addToCart,
  resendVerificationCode,
  getUserById,
  GetAllUsers
} = require("../../controllers/User/userController")

// const authRoutes = require("../../middlewares/authRoutes");

router.get("/",GetAllUsers);
router.post("/signup", SignUp);
router.post("/login", LogIn);
router.get('/user/:userId', getUserById);
router.post('/verify-email/:userId', verifyEmail);
router.post('/resend-verification/:userId',resendVerificationCode)


// router.use(authRoutes);

router.get("/view-furnitures",viewFurnitures)
router.get("/cart/view-cart",viewCart)
router.post("/cart/add-to-cart",addToCart)
router.post("/logout", Logout);

module.exports = router;
