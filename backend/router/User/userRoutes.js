const express = require("express");
const router = express.Router();
const {
  SignUp,
  LogIn,
  Logout,
  verifyEmail,
  resendVerificationCode,
  UpdateUserInformation,
  unconfirmedUser,
  ViewProfile,
  passwordReset,
  verifyPRCode,
  createNewPswd
} = require("../../controllers/User/userController")
const {checkUserAuth} = require('../../middlewares/checkAuth');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/signup", SignUp);
router.post("/login", LogIn);
router.get('/unconfirmed/:userId',unconfirmedUser);
router.post('/verify-email/:userId', verifyEmail);
router.post('/resend-verification/:userId',resendVerificationCode);

// password reset
router.post('/password-reset/request', checkUserAuth, passwordReset)
router.post('/password-reset/verify', checkUserAuth, verifyPRCode);
router.post('/password-reset/new', checkUserAuth, createNewPswd);
router.get('/setting/my-profile/view',checkUserAuth,ViewProfile);
router.put('/setting/my-profile/update', checkUserAuth,upload.single('image'),UpdateUserInformation);
router.post("/logout", checkUserAuth, Logout);

module.exports = router;
