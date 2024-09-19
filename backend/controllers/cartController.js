const Cart = require('../models/cartModel');
const Furniture = require('../models/furnitureModel');
const User = require('../models/userModel');

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

exports.addItemsToCart = async (req, res) => {
  const { userId } = req.params;
  const { items } = req.body; // Array of { furnitureId, quantity }

  try {
    let cart = await Cart.findOne({ userId });

    // Validate that all furniture items exist
    for (const item of items) {
      const furniture = await Furniture.findById(item.furnitureId);
      if (!furniture) {
        return res.status(404).json({ message: `Furniture with ID ${item.furnitureId} not found` });
      }
    }

    // If cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({ userId, items });
      
      // Save the new cart
      await cart.save();

      // Update the user's cart reference
      await User.findByIdAndUpdate(userId, { cart: cart._id });
    } else {
      // Loop through the new items and add them to the cart
      for (const newItem of items) {
        const itemIndex = cart.items.findIndex(item => item.furnitureId.equals(newItem.furnitureId));

        if (itemIndex > -1) {
          // If the item exists, update the quantity
          cart.items[itemIndex].quantity += newItem.quantity;
        } else {
          // If the item doesn't exist, add it to the cart
          cart.items.push(newItem);
        }
      }

      // Save the updated cart
      await cart.save();
    }

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
