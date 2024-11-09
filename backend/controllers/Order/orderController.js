const Order = require("../../models/Order/orderModel");
const Cart = require("../../models/Cart/cartModel");
const User = require("../../models/User/userModel");

const orderController = {
	// Create new order from cart
	createOrder: async (req, res) => {
		try {
			const { paymentMethod, shippingAddress, deliveryMode, expectedDelivery } = req.body;
			const userId = req.user._id;

			if (!paymentMethod) {
				return res.status(400).json({
					error: "Please select a payment method to proceed.",
				});
			}

			if (["GCash", "Maya"].includes(paymentMethod) && !req.file) {
				return res.status(400).json({
					error: "Please upload proof of payment for the selected method.",
				});
			}

			let proofOfPayment;
			if (req.file) {
				proofOfPayment = req.file.buffer.toString("base64");
			}

			const cart = await Cart.findOne({ userId });
			if (!cart || cart.items.length === 0) {
				return res.status(400).json({ error: "Cart is empty" });
			}
			console.log(cart)
			console.log("Expected delivery: ", cart.expectedDelivery)

			const shippingAddressObj = JSON.parse(shippingAddress);
			const municipality = shippingAddressObj.municipality;

			// Calculate shipping fee
			const shippingFees = {
				Boac: 500,
				Mogpog: 700,
				Gasan: 500,
				Buenavista: 800,
				Santa_Cruz: 3000,
				Torrijos: 3000,
			};
			const shippingFee = shippingFees[municipality] || 0; // Default to 0 if municipality is not listed

			const order = await Order.createFromCart(
				cart._id,
				paymentMethod,
				proofOfPayment,
				shippingAddressObj,
				shippingFee,
				deliveryMode,
				expectedDelivery
				
			);

			await Cart.findByIdAndUpdate(cart._id, {
				items: [],
				count: 0,
				totalAmount: 0,
			});

			await User.findByIdAndUpdate(userId, {
				$push: { orders: order._id, proofOfPayment },
			});

			res.status(201).json({ success: "Order placed successfully!", order });
		} catch (error) {
			console.error("Error creating order:", error);
			res.status(500).json({
				error: "Error creating order",
			});
		}
	},

	preOrder: async(req, res) => {
		try {

			const {funitureId, quantity = 1, material, color, size,  paymentOption, paymentMethod, shippingAddress, deliveryMode} = req.body;
			const userId = req.user._id;
			const user = await User.findById(userId);
			if(!user) return res.status(404).json({message:"User not found!"});

			const preOrder = new Order({
				user:userId,
				furniture:funitureId,
				material:material,
				size:size,
				color:color,
				quantity: quantity,
				shippingAddress:shippingAddress,
				paymentOption:paymentOption,
				paymentMethod : paymentMethod,
				proofOfPayment,
				deliveryMode:deliveryMode,
				subtotal,
				shippingFee,
				totalAmount,
			})

			console.log(preOrder);
			return res.status(201).json({message:"Pre-order was created!", preOrder})

		} catch (error) {
			console.log("Error creating pre-order:",error);
			res.status(500).json({message:"Server error!"});
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
				.populate("user")
				.populate("items.furniture");

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

			res.status(200).json(order);
		} catch (error) {
			console.log("Error fetching order : ", error);
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
