const express = require("express");
const router = express.Router();
const {AdminSignup, AdminLogin, AllAdmins,verifyEmail} = require('../controllers/adminController');

router.get("/",AllAdmins)

router.post("/signup",AdminSignup)
router.post("/verify-email",verifyEmail)
router.post("/login",AdminLogin)

module.exports = router;