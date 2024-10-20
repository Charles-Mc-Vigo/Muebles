const express = require("express");
const router = express.Router();
const {
  SignUp,
  LogIn,
  Logout,
  verifyEmail,
  resendVerificationCode,
  UpdateUserInformation,
  unconfirmedUser
} = require("../../controllers/User/userController")
const {checkUserAuth} = require('../../middlewares/checkAuth');


router.post("/signup", SignUp);
router.post("/login", LogIn);
router.get('/unconfirmed/:userId',unconfirmedUser)
router.post('/verify-email/:userId', verifyEmail);
router.post('/resend-verification/:userId',resendVerificationCode)
router.put('/settings/update/:userId', checkUserAuth,UpdateUserInformation);
router.post("/logout", checkUserAuth, Logout);

module.exports = router;
