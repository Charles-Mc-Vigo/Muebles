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
  getUserById
} = require("../../controllers/User/userController")

const authRoutes = require("../../middlewares/authRoutes");
router.get('/:userId', getUserById);
router.post('/:userId/verify-email', verifyEmail);
router.post('/:userId/resend-verification',resendVerificationCode)
router.post("/signup", SignUp);
router.post("/login", LogIn);


router.use(authRoutes);

router.get("/view-furnitures",viewFurnitures)
router.get("/cart/view-cart",viewCart)
router.post("/cart/add-to-cart",addToCart)
router.post("/logout", Logout);

module.exports = router;
