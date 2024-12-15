const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/Order/orderController');
const { checkUserAuth, checkAdminAuth } = require('../../middlewares/checkAuth');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// User routes - protected with checkUserAuth
router.post("/create", checkUserAuth, upload.single("proofOfPayment"), orderController.createOrder);
router.post("/pre-order/create", checkUserAuth, upload.single("proofOfPayment"), orderController.preOrder);
router.post("/upload-design-image/create", checkUserAuth, upload.single("designImages"), orderController.createImageUploadOrder);
router.get("/uploaded-images-orders/:orderId", checkAdminAuth, orderController.ImageUploadedOrderById);
router.get("/uploaded-images-orders", checkAdminAuth, orderController.ImageUploadedOrder);
router.get('/my-orders', checkUserAuth, orderController.getUserOrders);
router.get('/details/:orderId', checkUserAuth, orderController.getOrderDetails);
router.put('/cancel/:orderId', checkUserAuth, orderController.cancelOrder);
router.put('/update/:orderId',checkAdminAuth,orderController.updateOrderStatus);
router.post("/confirm-delivery/:orderId", checkUserAuth, orderController.confirmedDelivery);
router.get("/:orderNumber", checkAdminAuth, orderController.getOrderByOrderNumber);
router.get("/generate-order/monthly", checkAdminAuth, orderController.generateMonthlyOrders);
router.post("/request-for-repair/:orderId", checkUserAuth,orderController.requestForRepair);
router.get('/',orderController.Orders);


module.exports = router;