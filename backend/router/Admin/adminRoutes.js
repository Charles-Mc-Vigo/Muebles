const express = require("express");
const router = express.Router();
const {AdminSignup, AdminLogin, AllAdmins,verifyEmail, adminLogout, getAdminById, PendingAdminRequest, AcceptAdminRequest, updateProfile, myProfile} = require('../../controllers/Admin/adminController');
const adminOnly = require('../../middlewares/adminOnly');
const multer = require('multer');

// Multer setup for in-memory image upload (buffer)
const storage = multer.memoryStorage(); // Use memoryStorage to avoid saving the file to disk
const upload = multer({ storage: storage });



//admin log in and signup flow
router.post("/signup",AdminSignup)
router.post("/login",AdminLogin)
router.post("/verify-account/:adminId",verifyEmail)
router.post("/accept-request/:adminId", adminOnly(["Admin Manager"]), AcceptAdminRequest); //only admin manager here
router.get('/:adminId', getAdminById)
router.post("/logout", adminLogout)

router.get("/",AllAdmins)
//notification
router.get("/notification/pending-request",PendingAdminRequest);

//settings
router.put("/setting/update-profile",upload.single('image'),updateProfile)
router.get("/setting/my-profile/view",myProfile);


module.exports = router;