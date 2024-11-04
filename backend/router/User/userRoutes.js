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
  createNewPswd,
  getUserId,
  getAllUsers,
  AddNewAddress,
  GetUserAddresses,
  userData,
  updateAddress
} = require("../../controllers/User/userController")
const {checkUserAuth, checkAdminAuth} = require('../../middlewares/checkAuth');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Auth routes
router.post("/signup", SignUp);
router.post("/login", LogIn);
router.post("/logout", checkUserAuth, Logout);

// Email verification routes
router.get('/unconfirmed/:userId', unconfirmedUser);
router.post('/verify-email/:userId', verifyEmail);
router.post('/resend-verification/:userId', resendVerificationCode);

// Password reset routes
router.post('/password-reset/request', passwordReset);
router.post('/password-reset/verify/:userId', verifyPRCode);
router.post('/password-reset/new-password/:userId', createNewPswd);

// Profile routes
router.get('/setting/my-profile/view', checkUserAuth, ViewProfile);

router.put('/setting/my-profile/update', checkUserAuth, upload.single('image'), UpdateUserInformation);

// Address routes
router.get('/address', checkUserAuth, GetUserAddresses);
router.post('/address/new', checkUserAuth, AddNewAddress);
router.put('/address/update/:addressId', checkUserAuth, updateAddress);

// Admin routes
router.get('/', checkAdminAuth, getAllUsers);
router.get('/data', checkUserAuth, userData);
router.get('/:userId', getUserId);

module.exports = router;