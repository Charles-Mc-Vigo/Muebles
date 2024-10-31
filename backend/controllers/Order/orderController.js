const Order = require("../../models/Order/orderModel");
const Cart = require("../../models/Cart/cartModel");
const User = require("../../models/User/userModel");
const Furniture = require("../../models/Furniture/furnitureModel");

const orderController = {
	// Create new order from cart
	createOrder: async (req, res) => {
		try {
			const { paymentMethod } = req.body;
			const userId = req.user._id; // Using ID from cookie token

			// Validate that payment method is provided
			if (!paymentMethod) {
				return res.status(400).json({
					error: "Please select a payment method to proceed.",
				});
			}

			// For specific payment methods (e.g., GCash, Maya, COD), ensure proof of payment is provided
			if (["GCash", "Maya", "COD"].includes(paymentMethod)) {
				if (!req.file) {
					return res.status(400).json({
						error: "Please upload proof of payment for the selected method.",
					});
				}
			}

			// Check if payment method requires proof of payment
			let proofOfPayment;
			if (req.file) {
				// Convert the uploaded image to a base64-encoded string without the data URL prefix
				proofOfPayment = req.file.buffer.toString("base64");
			}

			// Find user's cart
			const cart = await Cart.findOne({ userId });
			if (!cart || cart.items.length === 0) {
				return res.status(400).json({ error: "Cart is empty" });
			}

			// Create the order with the proof of payment as base64
			const order = await Order.createFromCart(
				cart._id,
				paymentMethod,
				proofOfPayment
			);

			// Clear the cart
			await Cart.findByIdAndUpdate(cart._id, {
				items: [],
				count: 0,
				totalAmount: 0,
			});

			// Add the order to the user's orders array
			await User.findByIdAndUpdate(userId, {
				$push: { orders: order._id, proofOfPayment },
			});

			res.status(201).json({success: "Order placed successfully!", order});
		} catch (error) {
			console.error("Error creating order:", error);
			res.status(500).json({
				error: "Error creating order",
			});
		}
	},
	// Get user's orders
	getUserOrders: async (req, res) => {
		try {
			const userId = req.user._id;
			const orders = await Order.find({ user: userId })
				.populate("items.furniture user.firstname")
				.sort({ createdAt: -1 });

			res.status(200).json(orders);
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error fetching orders",
				error: error.message,
			});
		}
	},

	// Get single order details
	getOrderDetails: async (req, res) => {
		try {
			const { orderId } = req.params;
			const userId = req.user._id;
			const order = await Order.findById(orderId)
				.populate("items.furniture")
				.populate("user", "firstname lastname email");

			if (!order) {
				return res.status(404).json({
					error: "Order not found",
				});
			}

			// Check if order belongs to user (for non-admin users)
			if (!req.admin && order.user._id.toString() !== userId) {
				return res.status(403).json({
					error: "Not authorized to view this order",
				});
			}

			res.status(200).json({order});
		} catch (error) {
			console.log("Error fetching order : ",error)
			res.status(500).json({
				error: "Server error!",
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
					message: "Order not found",
				});
			}

			// Check if order belongs to user
			if (order.user.toString() !== userId) {
				return res.status(403).json({
					success: false,
					message: "Not authorized to cancel this order",
				});
			}

			// Only allow cancellation of pending orders
			if (order.orderStatus !== "pending") {
				return res.status(400).json({
					success: false,
					message: "Order cannot be cancelled at this stage",
				});
			}

			order.orderStatus = "cancelled";
			await order.save();

			res.status(200).json({
				success: true,
				message: "Order cancelled successfully",
				order,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error cancelling order",
				error: error.message,
			});
		}
	},

	// Admin: Get all orders
	getAllOrders: async (req, res) => {
		try {
			const orders = await Order.find(req.query)
				.populate("user", "firstname lastname email phoneNumber")
				.populate("items.furniture")
				.sort({ createdAt: -1 });

			res.status(200).json({
				success: true,
				orders,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error fetching all orders",
				error: error.message,
			});
		}
	},

	createDirectOrder: async (req, res) => {
		try {
			const { paymentMethod } = req.body;
			const userId = req.user._id;
			const { furnitureId } = req.params;
			const { quantity = 1 } = req.body;

			// Validate that payment method is provided
			if (!paymentMethod) {
				return res.status(400).json({
					success: false,
					message: "Please select a payment method to proceed.",
				});
			}

			// For specific payment methods, ensure proof of payment is provided
			if (["GCash", "Maya"].includes(paymentMethod)) {
				if (!req.file) {
					return res.status(400).json({
						success: false,
						message: "Please upload proof of payment for the selected method.",
					});
				}
			}

			// Check if furniture exists and has sufficient stock
			const furniture = await Furniture.findById(furnitureId);
			if (!furniture) {
				return res.status(404).json({
					success: false,
					message: "Furniture not found!",
				});
			}

			if (furniture.stockQuantity < quantity) {
				return res.status(400).json({
					success: false,
					message: `Insufficient stock. Only ${furniture.stockQuantity} units available.`,
				});
			}

			// Prepare order data
			const orderData = {
				userId,
				items: [
					{
						furnitureId,
						quantity,
					},
				],
				paymentMethod,
				proofOfPayment: req.file
					? req.file.buffer.toString("base64")
					: undefined
			};

			// Create the order using the model's static method
			const order = await Order.createDirectOrder(orderData);

			// Update furniture stock
			await Furniture.findByIdAndUpdate(furnitureId, {
				$inc: { stockQuantity: -quantity },
			});

			// Send success response
			res.status(201).json({
				success: true,
				message: "Order created successfully",
				order
			});
		} catch (error) {
			console.error("Error in creating direct order:", error);

			// Handle specific error cases
			if (error.message.includes("Missing required fields")) {
				return res.status(400).json({
					success: false,
					message: "Missing required order information",
				});
			}

			if (error.message.includes("Insufficient stock")) {
				return res.status(400).json({
					success: false,
					message: error.message,
				});
			}

			if (error.message.includes("User not found")) {
				return res.status(404).json({
					success: false,
					message: "User account not found",
				});
			}

			// Generic error response
			res.status(500).json({
				success: false,
				message: "Server error while processing your order",
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
					message: "Order status is required",
				});
			}

			const order = await Order.findByIdAndUpdate(
				req.params.orderId,
				{ orderStatus },
				{ new: true }
			)
				.populate("items.furniture")
				.populate("user", "firstname lastname email phoneNumber");

			if (!order) {
				return res.status(404).json({
					success: false,
					message: "Order not found",
				});
			}

			res.status(200).json({
				success: true,
				message: "Order status updated successfully",
				order,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Error updating order status",
				error: error.message,
			});
		}
	},
};

module.exports = orderController;
