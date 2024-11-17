const Order = require("../../models/Order/orderModel");
const Cart = require("../../models/Cart/cartModel");
const User = require("../../models/User/userModel");
const Furniture = require("../../models/Furniture/furnitureModel");
const Materials = require("../../models/Furniture/materialsModel");
const FurnitureType = require("../../models/Furniture/furnitureTypeModel");
const Category = require("../../models/Furniture/categoryModel");

const orderController = {
	// Create new order from cart
	createOrder: async (req, res) => {
		try {
			const {
				paymentMethod,
				shippingAddress,
				deliveryMode,
				expectedDelivery,
				paymentOption,
			} = req.body;
			const userId = req.user._id;

			// res.status(200).json(paymentOption)
			//decision kung if partial or payment
			if (paymentOption === "Partial Payment") {
				console.log("Payment option is Partial payment");
			} else {
				console.log("Payment option is Full payment");
			}

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
			// console.log(cart);
			// console.log("Expected delivery: ", cart.expectedDelivery);

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
			const shippingFee = shippingFees[municipality] || 0;
			// console.log(shippingFee)

			const order = await Order.createFromCart(
				cart._id,
				paymentMethod,
				proofOfPayment,
				paymentOption,
				shippingAddress,
				shippingFee,
				deliveryMode,
				expectedDelivery
			);

			// await Cart.findByIdAndUpdate(cart._id, {
			// 	items: [],
			// 	count: 0,
			// 	totalAmount: 0,
			// });

			// await User.findByIdAndUpdate(userId, {
			// 	$push: { orders: order._id, proofOfPayment },
			// });

			res.status(201).json({ success: "Order placed successfully!", order });
		} catch (error) {
			console.error("Error creating order:", error);
			res.status(500).json({
				error: "Error creating order",
			});
		}
	},

	preOrder: async (req, res) => {
		try {
			const {
				quantity,
				furnitureId,
				color,
				material,
				size,
				paymentMethod,
				paymentOption,
				deliveryMode,
				shippingAddress,
				expectedDelivery,
			} = req.body;

			const userId = req.user._id;
			const user = await User.findById(userId);
			if (!user) return res.status(404).json({ message: "User not found!" });

			// Calculate subtotal based on furniture price (assuming you have a way to get the price)
			const furniture = await Furniture.findById(furnitureId);
			if (!furniture)
				return res.status(404).json({ message: "Furniture not found!" });

			const furnitureCategoryId = furniture.category;
			const furnitureFurnitureType = furniture.furnitureType;

			const category = await Category.findById(furnitureCategoryId);
			const furnitureType = await FurnitureType.findById(
				furnitureFurnitureType
			);

			// const furnitureType = await FurnitureType.findById(category._id);

			// res.status(200).json({message:`${furnitureType.name} found`, furnitureType});

			// res.status(200).json({message:`${category.name} found`, category});

			// const furnitureTypeECT = await FurnitureType({name:{$in:{furniture.category}}})

			if (!["Partial Payment", "Full Payment"].includes(paymentOption)) {
				return res
					.status(400)
					.json({ message: "Please select only valid payment options!" });
			}

			const selectedMaterial = await Materials.findOne({
				name: { $in: material },
			});
			// res.status(201).json(selectedMaterial.price);

			const subtotal = selectedMaterial.price * quantity;
			console.log("Subtotal of the item: ",subtotal)
			// res.status(201).json(subtotal);

			// const subtotal = furniture.price * quantity;

			// Calculate shipping fee (you can adjust this logic as needed)
			const shippingFees = {
				Boac: 500,
				Mogpog: 700,
				Gasan: 500,
				Buenavista: 800,
				Santa_Cruz: 3000,
				Torrijos: 3000,
			};
			const shippingAddressObj = JSON.parse(shippingAddress);
			const municipality = shippingAddressObj.municipality;
			const shippingFee = shippingFees[municipality] || 0;
			
			// Calculate total amount
			const totalAmount = subtotal + shippingFee;
			console.log(`Shipping fee is ${shippingFee} + ${subtotal} = total amount of ${totalAmount}`)
			// res.status(201).json(shippingFee);

			let proofOfPayment;
			if (req.file) {
				proofOfPayment = req.file.buffer.toString("base64");
			}

			const preOrder = await Order.preOrder(
				user,
				furniture,
				material,
				color,
				size,
				quantity,
				paymentMethod,
				proofOfPayment,
				paymentOption,
				shippingAddress,
				shippingFee,
				deliveryMode,
				expectedDelivery,
				subtotal,
				totalAmount
			);

			await preOrder.save(); // Save the pre-order to the database

			await User.findByIdAndUpdate(userId, {
				$push: { orders: preOrder._id, proofOfPayment },
			});

			console.log(preOrder);
			return res
				.status(201)
				.json({ message: "Pre-order was created!", preOrder });
		} catch (error) {
			console.log("Error creating pre-order:", error);
			res.status(500).json({ message: "Server error!" });
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
				await order.populate("furniture"); // Populate order.furniture for Pre-Orders
			} else {
				await order.populate("items.furniture"); // Populate items.furniture for other types
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
