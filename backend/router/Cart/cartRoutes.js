const express = require('express');
const { addToCart, removeItemFromCart, updateItemQuantities, getCart, checkout} = require('../../controllers/Cart/cartController');
const router = express.Router();
const {checkUserAuth} = require('../../middlewares/checkAuth');

router.get('/', checkUserAuth, getCart);
router.post('/add', checkUserAuth ,addToCart);
router.put('/update', checkUserAuth, updateItemQuantities);
router.delete('/remove', checkUserAuth, removeItemFromCart);
router.post('/checkout', checkUserAuth, checkout);

module.exports = router;
