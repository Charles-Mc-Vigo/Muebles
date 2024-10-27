const Order = require('../../models/Order/orderModel');
const Cart = require('../../models/Cart/cartModel');
const User = require('../../models/User/userModel');

const orderController = {
  // Create new order from cart
  createOrder: async (req, res) => {
    try {
      const { paymentMethod } = req.body;
      const userId = req.user._id; // Using ID from cookie token

      // Find user's cart
      const cart = await Cart.findOne({userId : userId} );
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      if(!paymentMethod) return res.status(400).json({message:"Please select payment method to proceed"});

      // Create order from cart
      const order = await Order.createFromCart(cart._id, paymentMethod);

      // Clear the cart
      await Cart.findByIdAndUpdate(cart._id, {
        items: [],
        count: 0,
        totalAmount: 0
      });

      // Add order to user's orders array
      await User.findByIdAndUpdate(userId, {
        $push: { orders: order._id }
      });

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        order
      });
    } catch (error) {
      console.error("Error creating an order: ",error)
      res.status(500).json({
        success: false,
        message: "Error creating order",
        error: error.message
      });
    }
  },

  // Get user's orders
  getUserOrders: async (req, res) => {
    try {
      const userId = req.user._id;
      const orders = await Order.find({ user: userId })
        .populate('items.furniture')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        orders
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching orders",
        error: error.message
      });
    }
  },

  // Get single order details
  getOrderDetails: async (req, res) => {
    try {
      const {orderId} = req.params;
      const userId = req.user._id;
      const order = await Order.findById(orderId)
        .populate('items.furniture')
        .populate('user', 'firstname lastname email');

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      // Check if order belongs to user (for non-admin users)
      if (!req.admin && order.user._id.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to view this order"
        });
      }

      res.status(200).json({
        success: true,
        order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching order details",
        error: error.message
      });
    }
  },

  // Cancel order (user)
  cancelOrder: async (req, res) => {
    try {
      const userId = req.user._id;
      const order = await Order.findById(req.params.orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      // Check if order belongs to user
      if (order.user.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to cancel this order"
        });
      }

      // Only allow cancellation of pending orders
      if (order.orderStatus !== 'pending') {
        return res.status(400).json({
          success: false,
          message: "Order cannot be cancelled at this stage"
        });
      }

      order.orderStatus = 'cancelled';
      await order.save();

      res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error cancelling order",
        error: error.message
      });
    }
  },

  // Admin: Get all orders
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find(req.query)
        .populate('user', 'firstname lastname email phoneNumber')
        .populate('items.furniture')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        orders
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching all orders",
        error: error.message
      });
    }
  },

  // Admin: Update order status
  updateOrderStatus: async (req, res) => {
    try {
      const { orderStatus } = req.body;
      
      if (!orderStatus) {
        return res.status(400).json({
          success: false,
          message: "Order status is required"
        });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.orderId,
        { orderStatus },
        { new: true }
      ).populate('items.furniture')
        .populate('user', 'firstname lastname email phoneNumber');

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating order status",
        error: error.message
      });
    }
  }
};

module.exports = orderController;