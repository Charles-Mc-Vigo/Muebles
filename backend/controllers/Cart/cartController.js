// controllers/Cart/cartController.js
const User = require('../../models/User/userModel');
const Cart = require('../../models/Cart/cartModel');
const Furniture = require('../../models/Furniture/furnitureModel');

exports.getCartId = async (req,res) => {
  try {
    const {cartId} = req.params;
    const cart = await Cart.findById(cartId);

    if(!cart) return res.status(400).json({message:"Cart not found!"});

    res.status(200).json(cart)
  } catch (error) {
    console.error("Error get cart by id: ",error);
    res.status(500).json({message:"Server error!"});
  }
}

// View Cart
exports.viewCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found!" });

    // Get user's single cart
    const cart = await Cart.findOne({ userId: user._id })
      .populate({
        path: 'items.furnitureId',
        select: 'name description price images'
      });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: { items: [], count: 0, totalAmount: 0 }
      });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error in viewing the cart", error);
    res.status(500).json({ message: "Server error!" });
  }
};

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { furnitureId, quantity = 1 } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) return res.status(404).json({ message: "User not found!" });

    // Find or create single cart for user
    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      cart = await Cart.create({
        userId: user._id,
        items: [],
        count: 0,
        totalAmount: 0
      });
      // Update user's cart reference
      user.cart = [cart._id];
      await user.save();
    }

    // Verify furniture exists
    const furniture = await Furniture.findById(furnitureId);
    if (!furniture) return res.status(404).json({ message: "Furniture not found!" });

    // Update existing item or add new item
    const existingItemIndex = cart.items.findIndex(
      item => item.furnitureId.toString() === furnitureId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        furnitureId,
        quantity
      });
    }

    // Update totals
    cart.count = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalAmount = await calculateTotalAmount(cart.items);

    await cart.save();

    // Populate furniture details
    await cart.populate('items.furnitureId', 'name description price image');

    res.status(200).json({ message: "Item added to cart successfully", cart });
  } catch (error) {
    console.error("Error in adding to cart", error);
    res.status(500).json({ message: "Server error!" });
  }
};

// Update Cart Item
exports.updateCartItem = async (req, res) => {
  try {
    const { furnitureId, quantity } = req.body;
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found!" });

    const itemIndex = cart.items.findIndex(
      item => item.furnitureId.toString() === furnitureId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart!" });
    }

    cart.items[itemIndex].quantity = quantity;
    
    // Update totals
    cart.count = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalAmount = await calculateTotalAmount(cart.items);

    await cart.save();
    await cart.populate('items.furnitureId', 'name description price image');

    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error in updating cart", error);
    res.status(500).json({ message: "Server error!" });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { furnitureId } = req.params;
    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) return res.status(404).json({ message: "Cart not found!" });

    cart.items = cart.items.filter(
      item => item.furnitureId.toString() !== furnitureId
    );

    // Update totals
    cart.count = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalAmount = await calculateTotalAmount(cart.items);

    await cart.save();
    await cart.populate('items.furnitureId', 'name description price image');

    res.status(200).json({ message: "Item removed from cart successfully", cart });
  } catch (error) {
    console.error("Error in removing from cart", error);
    res.status(500).json({ message: "Server error!" });
  }
};

// Clear Cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found!" });

    cart.items = [];
    cart.count = 0;
    cart.totalAmount = 0;
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    console.error("Error in clearing cart", error);
    res.status(500).json({ message: "Server error!" });
  }
};

// Helper function to calculate total amount
async function calculateTotalAmount(items) {
  let total = 0;
  for (const item of items) {
    const furniture = await Furniture.findById(item.furnitureId);
    if (furniture) {
      total += furniture.price * item.quantity;
    }
  }
  return total;
}