const Cart = require('../models/cartModel');
const Furniture = require('../models/furnitureModel');

// Get Cart by userId
exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.furnitureId');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add Item to Cart
exports.addItemToCart = async (req, res) => {
  const { userId } = req.params;
  const { furnitureId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    // Check if the furniture exists
    const furniture = await Furniture.findById(furnitureId);
    if (!furniture) return res.status(404).json({ message: 'Furniture not found' });

    // If cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({ userId, items: [{ furnitureId, quantity }] });
    } else {
      // Check if the item is already in the cart
      const itemIndex = cart.items.findIndex(item => item.furnitureId.equals(furnitureId));
      if (itemIndex > -1) {
        // If the item exists, update the quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // If the item doesn't exist, add it to the cart
        cart.items.push({ furnitureId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Remove Item from Cart
exports.removeItemFromCart = async (req, res) => {
  const { userId } = req.params;
  const { furnitureId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => !item.furnitureId.equals(furnitureId));
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Clear Cart
exports.clearCart = async (req, res) => {
  const { userId } = req.params;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
