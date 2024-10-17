const express = require("express");
const router = express.Router();
const {AdminSignup, AdminLogin, AllAdmins,verifyEmail,getUsers, adminLogout, getAdminById, PendingAdminRequest, AcceptAdminRequest} = require('../../controllers/Admin/adminController');
const adminOnly = require('../../middlewares/adminOnly');


router.get("/",AllAdmins)
router.get("/notification/pending-request",PendingAdminRequest);

//admin log in and signup
router.post("/signup",AdminSignup)
router.post("/:adminManagerId/accept-request",AcceptAdminRequest);
router.get('/:adminId',getAdminById)
router.post("/admin-verification/:adminId",verifyEmail)
router.post("/login",AdminLogin)
router.post("/logout/:adminId",adminLogout)

router.use(adminOnly)
//users
router.get("/users",getUsers)


module.exports = router;