const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/Order/orderController');
const { checkUserAuth } = require('../../middlewares/checkAuth');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// User routes - protected with checkUserAuth
router.post("/direct-order/:furnitureId", checkUserAuth, upload.single("proofOfPayment"), orderController.createDirectOrder);
router.post("/create", checkUserAuth, upload.single("proofOfPayment"), orderController.createOrder);
router.get('/my-orders', checkUserAuth, orderController.getUserOrders);
router.get('/details/:orderId', checkUserAuth, orderController.getOrderDetails);
router.put('/cancel/:orderId', checkUserAuth, orderController.cancelOrder);
router.put('/update/:orderId',checkUserAuth,orderController.updateOrderStatus);


module.exports = router;