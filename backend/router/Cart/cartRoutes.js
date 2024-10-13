const express = require('express');
const { addItemsToCart, removeItemFromCart, updateItemQuantities, getCart, checkout} = require('../../controllers/Cart/cartController');
const router = express.Router();

router.get('/cart/:userId', getCart);
router.post('/cart/:userId/checkout', checkout);
router.post('/cart/:userId/add', addItemsToCart);
router.put('/cart/:userId/update', updateItemQuantities);
router.delete('/cart/:userId/remove', removeItemFromCart);

module.exports = router;
