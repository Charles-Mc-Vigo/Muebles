const express = require("express");
const router = express.Router();
const {AdminSignup, AdminLogin, AllAdmins, verifyEmail, adminLogout, getAdminById, PendingAdminRequest, AcceptAdminRequest, ViewRequest, updateProfile, myProfile, unconfirmedAdmin, viewPendingOrder, AcceptOrder, getOrderId , cancelOrder, getOrderByOrderNumber, RejectAdminRequest} = require('../../controllers/Admin/adminController');
const orderController = require('../../controllers/Order/orderController')
const { checkAdminAuth } = require('../../middlewares/checkAuth');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Public routes
router.post("/signup", AdminSignup);
router.post("/login", AdminLogin);
router.post("/verify-account/:adminId", verifyEmail);
router.get('/unconfirmed/:adminId',unconfirmedAdmin)

// Protected routes
router.get("/", checkAdminAuth, AllAdmins);
router.post("/logout", checkAdminAuth, adminLogout);

// notification
router.get("/notifications/pending-request", checkAdminAuth, PendingAdminRequest);
router.get("/notifications/pending-orders",checkAdminAuth, viewPendingOrder);
router.get("/notifications/pending-request/:adminId", checkAdminAuth, ViewRequest);
router.post("/notifications/accept-request/:adminId", checkAdminAuth, AcceptAdminRequest);
router.post("/notifications/reject-request/:adminId", checkAdminAuth, RejectAdminRequest);
router.post('/notifications/accept-order/:orderId',checkAdminAuth,AcceptOrder);
router.put('/notifications/cancel-order/:orderId',checkAdminAuth,cancelOrder);

router.get('/verified/:adminId', checkAdminAuth, getAdminById);
router.put("/setting/update-profile", checkAdminAuth, upload.single('image'), updateProfile);
router.get("/setting/my-profile/view", checkAdminAuth, myProfile);

router.get('/orders/all', checkAdminAuth, orderController.getAllOrders);
router.get('/order/:orderId',checkAdminAuth, getOrderId);
router.put('/order/status/:orderId', checkAdminAuth, orderController.updateOrderStatus);

module.exports = router;