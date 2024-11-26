const Order = require("../../models/Order/orderModel");
const Cart = require("../../models/Cart/cartModel");
const User = require("../../models/User/userModel");
const Furniture = require("../../models/Furniture/furnitureModel");
const Materials = require("../../models/Furniture/materialsModel");

const orderController = {
	// Create order from cart
	createOrder: async (req, res) => {
		try {
			const {
				paymentMethod,
				shippingAddress: shippingAddressStr,
				deliveryMode,
				expectedDelivery,
				paymentOption,
				totalAmount,
				shippingFee,
				totalAmountWithShippingFee,
				partialPayment,
				remainingBalance,
				montlyInstallment,
			} = req.body;

			const userId = req.user._id;

			if (!paymentMethod || !["GCash", "Maya"].includes(paymentMethod)) {
				return res.status(400).json({ error: "Invalid payment method" });
			}

			if (!shippingAddressStr) {
				return res.status(400).json({ error: "Shipping address is required" });
			}

			let shippingAddress;
			try {
				shippingAddress = JSON.parse(shippingAddressStr);
			} catch (error) {
				return res
					.status(400)
					.json({ error: "Invalid shipping address format" });
			}

			if (!req.file) {
				return res.status(400).json({ error: "Proof of payment is required" });
			}

			const proofOfPayment = req.file.buffer.toString("base64");

			const cart = await Cart.findOne({ userId }).populate("items.furnitureId");
			if (!cart || cart.items.length === 0) {
				return res.status(400).json({ error: "Cart is empty" });
			}

			// Adjust fields based on payment option
			const adjustedPartialPayment =
				paymentOption === "Full Payment" ? null : partialPayment;
			const adjustedRemainingBalance =
				paymentOption === "Full Payment" ? null : remainingBalance;
			const adjustedInstallment =
				paymentOption === "Full Payment" ? null : montlyInstallment;

			// Calculate due date only for partial payments
			let dueDate = null;
			if (paymentOption === "Partial Payment") {
				dueDate = new Date();
				dueDate.setDate(dueDate.getDate() + 30); // Set due date to 30 days from now
			}
			console.log(dueDate)

			// Set interest and lastPaymentDate to undefined for full payments
			const interest = paymentOption === "Full Payment" &&  undefined
			const lastPaymentDate =
				paymentOption === "Full Payment" && undefined

			const order = await Order.createFromCart(
				cart._id,
				paymentMethod,
				proofOfPayment,
				paymentOption,
				shippingAddress,
				deliveryMode,
				expectedDelivery,
				totalAmount,
				shippingFee,
				totalAmountWithShippingFee,
				adjustedPartialPayment,
				adjustedRemainingBalance,
				adjustedInstallment,
				dueDate,
				interest,
				lastPaymentDate
			);

			// Clear the user's cart after order creation
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
			res.status(500).json({ error: "Error creating order" });
		}
	},

	// Pre-order functionality
	preOrder: async (req, res) => {
		try {
			const {
				furnitureId,
				color,
				material,
				size,
				quantity,
				paymentMethod,
				paymentOption,
				shippingAddress,
				deliveryMode,
				expectedDelivery,
				subtotal,
				totalAmount,
				shippingFee,
				totalAmountWithShippingFee,
				partialPayment,
				remainingBalance,
				montlyInstallment,
			} = req.body;

			const userId = req.user._id;
			const user = await User.findById(userId);
			if (!user) return res.status(404).json({ message: "User not found!" });

			const furniture = await Furniture.findById(furnitureId);
			if (!furniture)
				return res.status(404).json({ message: "Furniture not found!" });

			const selectedMaterial = await Materials.findOne({ name: material });
			if (!selectedMaterial)
				return res.status(400).json({ error: "Invalid material selected!" });

			if (!req.file) {
				return res.status(400).json({ error: "Proof of payment is required" });
			}

			const proofOfPayment = req.file.buffer.toString("base64");
			// Calculate due date only for partial payments
			let dueDate = null;
			if (paymentOption === "Partial Payment") {
				dueDate = new Date();
				dueDate.setDate(dueDate.getDate() + 30); // Set due date to 30 days from now
			}

			// Set interest and lastPaymentDate to undefined for full payments
			const interest = paymentOption === "Full Payment" && undefined 
			const lastPaymentDate =
				paymentOption === "Full Payment" && undefined

			const preOrder = await Order.preOrder(
				user,
				furniture,
				color,
				material,
				size,
				quantity,
				paymentMethod,
				proofOfPayment,
				paymentOption,
				shippingAddress,
				deliveryMode,
				expectedDelivery,
				subtotal,
				totalAmount,
				shippingFee,
				totalAmountWithShippingFee,
				partialPayment,
				remainingBalance,
				montlyInstallment,
				dueDate,
				interest,
				lastPaymentDate
			);

			await User.findByIdAndUpdate(userId, {
				$push: { orders: preOrder._id, proofOfPayment },
			});

			console.log(preOrder);

			res.status(201).json({ message: "Pre-order created!", preOrder });
		} catch (error) {
			console.error("Error creating pre-order:", error);
			res.status(500).json({ message: "Server error!" });
		}
	},

	confirmedDelivery: async (req,res) => {
		try {
			const {orderId} = req.params
			const order = await Order.findById(orderId);

			if(!order) return res.status(404).json({message:"Order not found!"});

			order.isDelivered = true;
			await order.save();
			res.status(200).json({message:"Thankyou for confirmation!",order});
		} catch (error) {
			console.log("Error confirming the order: ", error);
			res.status(500).json({message:"Server error!"});
		}
	},

	// Get user's orders
	getUserOrders: async (req, res) => {
		try {
			const userId = req.user._id;
			const orders = await Order.find({ user: userId })
				.populate("items.furniture")
				.populate("user.firstname")
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

			// Fetch the order
			const order = await Order.findById(orderId).populate("user"); // Always populate user first

			// Check if the order exists
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

			// Conditionally populate based on order type
			if (order.type === "Pre-Order") {
				await order.populate("furniture");
			} else {
				await order.populate("items.furniture");
			}

			// Send the populated order as response
			res.status(200).json(order);
		} catch (error) {
			console.log("Error fetching order: ", error);
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

	getOrderByOrderNumber: async (req, res) => {
		try {
			const { orderNumber } = req.params;

			// Assuming `Order` is your Mongoose model
			const order = await Order.findOne({ orderNumber });

			if (!order) {
				return res.status(404).json({ message: "Order not found" });
			}

			res.status(200).json(order);
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	// Admin: Get all orders
	getAllOrders: async (req, res) => {
		try {
			const orders = await Order.find({
				orderStatus: { $nin: ["pending", "cancelled"] },
			})
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
