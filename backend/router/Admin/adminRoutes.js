const express = require("express");
const router = express.Router();
const {AdminSignup, AdminLogin, AllAdmins, verifyEmail, adminLogout, getAdminById, PendingAdminRequest, AcceptAdminRequest, updateProfile, myProfile, unconfirmedAdmin} = require('../../controllers/Admin/adminController');
const multer = require('multer');
const { checkAdminAuth } = require('../../middlewares/checkAuth'); // Import the checkAdminAuth middleware

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Public routes
router.post("/signup", AdminSignup);
router.post("/login", AdminLogin);
router.post("/verify-account/:adminId", verifyEmail);
router.get('/unconfirmed/:adminId',unconfirmedAdmin)

// Protected routes
router.post("/logout", checkAdminAuth, adminLogout);
router.get("/", checkAdminAuth, AllAdmins);
router.post("/notifications/accept-request/:adminId", checkAdminAuth, AcceptAdminRequest);
router.get('/verified/:adminId', checkAdminAuth, getAdminById);
router.get("/notifications/pending-request", checkAdminAuth, PendingAdminRequest);
router.put("/setting/update-profile", checkAdminAuth, upload.single('image'), updateProfile);
router.get("/setting/my-profile/view", checkAdminAuth, myProfile);

module.exports = router;