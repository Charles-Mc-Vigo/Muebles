const Cart = require('../../models/Cart/cartModel');
const User = require('../../models/User/userModel');
const Furniture = require('../../models/Furniture/furnitureModel');
const Order = require('../../models/Order/orderModel');

// Utility function to calculate totalAmount
const calculateTotalAmount = async (cart) => {
  let total = 0;
  for (const item of cart.items) {
    const furniture = await Furniture.findById(item.furnitureId);
    if (furniture) {
      total += furniture.price * item.quantity;
    }
  }
  return total;
};

// Add one or multiple items to the cart
exports.addItemsToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    let items = req.body.items;

    if (!Array.isArray(items)) {
      items = [items];
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      cart = new Cart({ userId: user._id, items: [], count: 0 });
    }

    for (const newItem of items) {
      const { furnitureId, quantity } = newItem;
      
      const itemIndex = cart.items.findIndex(item => item.furnitureId.toString() === furnitureId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ furnitureId, quantity });
      }

      cart.count += quantity;
    }

    cart.totalAmount = await calculateTotalAmount(cart);

    await cart.save();
    user.cart = cart._id;
    await user.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove one or more items from the cart
exports.removeItemFromCart = async (req, res) => {
  try {
    const { userId } = req.params;
    let furnitureIds = req.body.furnitureIds;

    if (!Array.isArray(furnitureIds)) {
      furnitureIds = [furnitureIds];
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const notFoundItems = [];
    const removedItems = [];

    cart.items = cart.items.filter(item => {
      if (furnitureIds.includes(item.furnitureId.toString())) {
        cart.count -= item.quantity;
        removedItems.push(item.furnitureId.toString());
        return false;
      }
      return true;
    });

    notFoundItems = furnitureIds.filter(id => !removedItems.includes(id));

    cart.totalAmount = await calculateTotalAmount(cart);
    await cart.save();

    res.status(200).json({
      message: 'Items updated in cart.',
      removedItems,
      notFoundItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update item quantity in the cart
exports.updateItemQuantities = async (req, res) => {
  try {
    const { userId } = req.params;
    const { furnitureId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const itemIndex = cart.items.findIndex(item => item.furnitureId.toString() === furnitureId);

    if (itemIndex > -1) {
      cart.count += (quantity - cart.items[itemIndex].quantity);
      cart.items[itemIndex].quantity = quantity;
    } else {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    cart.totalAmount = await calculateTotalAmount(cart);

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cart by userId
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate('items.furnitureId');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Checkout
exports.checkout = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const cart = await Cart.findOne({ userId: user._id }).populate('items.furnitureId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    const orderItems = cart.items.map(item => ({
      furniture: item.furnitureId._id,
      quantity: item.quantity
    }));

    const newOrder = new Order({
      userId: user._id,
      items: orderItems,
      totalAmount: cart.totalAmount,
      currency: "PHP",
      orderStatus: "Pending"
    });

    await newOrder.save();

    user.orders.push(newOrder._id);
    await user.save();

    // Clear the cart
    cart.items = [];
    cart.count = 0;
    cart.totalAmount = 0;
    await cart.save();

    res.status(200).json({
      message: 'Checkout successful',
      order: newOrder
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: error.message });
  }
};