const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Get the user's cart
router.get('/:userId', cartController.getCart);

// Add item to the cart
router.post('/:userId/add', cartController.addItemToCart);

// Remove item from the cart
router.post('/:userId/remove', cartController.removeItemFromCart);

// Clear the cart
router.post('/:userId/clear', cartController.clearCart);

module.exports = router;
