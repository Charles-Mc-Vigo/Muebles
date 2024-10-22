const express = require('express');
const { viewCart, addToCart, updateCartItem, removeFromCart, clearCart} = require('../../controllers/Cart/cartController');
const router = express.Router();
const {checkUserAuth} = require('../../middlewares/checkAuth');

router.get('/', checkUserAuth, viewCart);
router.post('/', checkUserAuth, addToCart);
router.put('/', checkUserAuth,  updateCartItem);
router.delete('/:furnitureId', checkUserAuth, removeFromCart);
router.delete('/', checkUserAuth, clearCart);

module.exports = router;
