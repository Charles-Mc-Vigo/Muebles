const express = require("express");
const router = express.Router();
const {
  SignUp,
  LogIn,
  Logout,
  verifyEmail,
  resendVerificationCode,
  getUserById,
  GetAllUsers,
  UpdateUserInformation
} = require("../../controllers/User/userController")

// const authRoutes = require("../../middlewares/authRoutes");

router.get("/",GetAllUsers);
router.post("/signup", SignUp);
router.post("/login", LogIn);
router.get('/user/:userId', getUserById);
router.post('/verify-email/:userId', verifyEmail);
router.post('/resend-verification/:userId',resendVerificationCode)
router.put('/settings/update/:userId',UpdateUserInformation);


// router.use(authRoutes);

router.post("/logout", Logout);

module.exports = router;
