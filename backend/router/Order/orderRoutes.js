const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/Order/orderController');
const { checkUserAuth } = require('../../middlewares/checkAuth');

// User routes - protected with checkUserAuth
router.post('/create', checkUserAuth, orderController.createOrder);
router.get('/my-orders', checkUserAuth, orderController.getUserOrders);
router.get('/details/:orderId', checkUserAuth, orderController.getOrderDetails);
router.put('/cancel/:orderId', checkUserAuth, orderController.cancelOrder);


module.exports = router;