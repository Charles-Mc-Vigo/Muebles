const express = require('express');
const { addItemsToCart, removeItemFromCart, updateItemQuantities, getCart } = require('../../controllers/Cart/cartController');
const router = express.Router();

router.get('/', (req,res) => {
  res.send("Cart Api is working!");
});
router.get('/cart/:userId', getCart);
router.post('/cart/:userId/add', addItemsToCart);
router.put('/cart/:userId/update', updateItemQuantities);
router.delete('/cart/:userId/remove', removeItemFromCart);

module.exports = router;
