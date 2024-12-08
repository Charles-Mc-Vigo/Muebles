const express = require('express');
const { createWalkInOrder, getWalkInOrders } = require('../../controllers/Order/walkInOrderController');

const router = express.Router();

// POST request to create a new walk-in order
router.post('/walk-in-orders', createWalkInOrder);

// GET request to fetch all walk-in orders
router.get('/walk-in-orders', getWalkInOrders);

module.exports = router;
