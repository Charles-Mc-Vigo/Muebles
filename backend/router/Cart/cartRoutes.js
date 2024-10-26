const express = require('express');
const { viewCart, addToCart, updateCartItem, removeFromCart, getCartId, clearCart} = require('../../controllers/Cart/cartController');
const router = express.Router();
const {checkUserAuth, checkAdminAuth} = require('../../middlewares/checkAuth');

router.get('/', checkUserAuth, viewCart);
router.get('/:cartId', checkAdminAuth, getCartId);
router.post('/', checkUserAuth, addToCart);
router.put('/', checkUserAuth,  updateCartItem);
router.delete('/:furnitureId', checkUserAuth, removeFromCart);
router.delete('/', checkUserAuth, clearCart);

module.exports = router;


  // GET (http://localhost:3000/api/cart) view cart
  // POST (http://localhost:3000/api/cart) add items to cart
  // PUT (http://localhost:3000/api/cart) update the cart item quantity
  // DELETE (http://localhost:3000/api/cart/:furnitureId) remove item in the cart
  // DELETE (http://localhost:3000/api/cart) clear the cart