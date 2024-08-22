const express = require("express");
const router = express.Router();
const {getAllOrders, createOrders, editOrder, getOrderById, deleteOrderById, getOrdersByStatus} = require("../controllers/orderController");
// const authRoutes = require("../middlewares/authRoutes");


// router.use(authRoutes)

//get all orders
router.get("/",getAllOrders);

//create orders
router.post("/create-orders",createOrders);

//get specific order by id
router.get("/:id",getOrderById);

//edit order information
router.put("/:id",editOrder)

//delete order
router.delete("/:id",deleteOrderById)

//get orders by status
router.get("/status/:orderStatus",getOrdersByStatus);

module.exports = router;