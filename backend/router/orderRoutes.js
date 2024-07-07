const express = require("express");
const router = express.Router();
const {getAllOrders, createOrders} = require("../controllers/orderController");

//get all orders
router.get("/",getAllOrders);

//create orders
router.post("/createOrders",createOrders);

//get specific order by id
router.get("/:id");

//edit order information
router.put("/:id")

//delete order
router.delete("/:id")

module.exports = router;