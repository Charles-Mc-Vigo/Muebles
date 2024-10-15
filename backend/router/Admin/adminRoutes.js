const express = require("express");
const router = express.Router();
const {AdminSignup, AdminLogin, AllAdmins,verifyEmail,getUsers, adminLogout, getAdminById} = require('../../controllers/Admin/adminController');
const adminOnly = require('../../middlewares/adminOnly');


router.get("/",AllAdmins)

//admin log in and signup
router.post("/signup",AdminSignup)
router.get('/:adminId',getAdminById)
router.post("/admin-verification/:adminId",verifyEmail)
router.post("/login",AdminLogin)

router.use(adminOnly)
//users
router.get("/users",getUsers)
router.post("/logout",adminLogout)


module.exports = router;