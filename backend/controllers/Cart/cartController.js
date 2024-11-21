// controllers/Cart/cartController.js
const User = require("../../models/User/userModel");
const Cart = require("../../models/Cart/cartModel");
const Furniture = require("../../models/Furniture/furnitureModel");

// View Cart
exports.viewCart = async (req, res) => {
	try {
		// Find the user by ID
		const user = await User.findById(req.user._id);
		if (!user) return res.status(404).json({ message: "User not found!" });

		// Find the cart and populate the items and user details
		const cart = await Cart.findOne({ userId: user._id })
			.populate({
				path: "items.furnitureId",
				select: "name description price images colors furnitureType"
			})
			.populate({
				path: "userId",
				select: "firstname lastname email phoneNumber addresses",
			});

		// If cart is empty
		if (!cart) {
			return res.status(200).json({
				success: true,
				message: "Cart is empty",
				data: { items: [], count: 0, totalAmount: 0 },
			});
		}

		res.status(200).json({ success: true, cart });
	} catch (error) {
		console.error("Error in viewing the cart", error);
		res.status(500).json({ message: "Server error!" });
	}
};

// Add to Cart
exports.addToCart = async (req, res) => {
	try {
		const { furnitureId, quantity = 1, material, color, size, price, ECT } = req.body;
		const user = await User.findById(req.user._id);

		if (!user) return res.status(404).json({ error: "User not found!" });

		// Validate required fields
		if (!material || !color || !size) {
			return res
				.status(400)
				.json({ error: "Please select material, color, and size." });
		}

		// Find or create a cart for the user
		let cart = await Cart.findOne({ userId: user._id });
		if (!cart) {
			cart = await Cart.create({
				userId: user._id,
				items: [],
				count: 0,
				totalAmount: 0,
			});
			user.cart = [cart._id];
			await user.save();
		}

		// Verify furniture exists
		const furniture = await Furniture.findById(furnitureId);
		if (!furniture)
			return res.status(404).json({ error: "Furniture not found!" });

		// Check if the exact item (with specific attributes) already exists in the cart
		const existingItemIndex = cart.items.findIndex(
			(item) =>
				item.furnitureId.toString() === furnitureId &&
				item.material === material &&
				item.color === color &&
				item.size === size &&
				item.price === price &&
				item.ECT === ECT 
		);

		if (existingItemIndex > -1) {
			cart.items[existingItemIndex].quantity += quantity;
		} else {
			cart.items.push({
				furnitureId,
				quantity,
				material,
				color,
				size,
				price,
				ECT,
			});
		}

		// Update totals
		cart.count = cart.items.reduce((total, item) => total + item.quantity, 0);
		cart.totalAmount = await calculateTotalAmount(cart.items);

		await cart.save();
		// console.log(cart)

		// Populate furniture details
		await cart.populate([
			{ path: "userId", select: "firstname email phoneNumber" },
			{ path: "items.furnitureId", select: "name description price image furnitureType" },
		]);

		res.status(200).json({ message: "Item added to cart successfully", cart });
	} catch (error) {
		console.error("Error in adding to cart", error);
		res.status(500).json({ error: "Server error!" });
	}
};

// Update Cart Item
exports.updateCartItem = async (req, res) => {
	try {
		const { furnitureId, quantity } = req.body;
		if (quantity < 1) {
			return res.status(400).json({ error: "Quantity must be at least 1" });
		}

		const cart = await Cart.findOne({ userId: req.user._id });
		if (!cart) return res.status(404).json({ error: "Cart not found!" });

		const itemIndex = cart.items.findIndex(
			(item) => item.furnitureId.toString() === furnitureId
		);

		if (itemIndex === -1) {
			return res.status(404).json({ error: "Item not found in cart!" });
		}

		cart.items[itemIndex].quantity = quantity;

		// Update totals
		cart.count = cart.items.reduce((total, item) => total + item.quantity, 0);
		cart.totalAmount = await calculateTotalAmount(cart.items);

		await cart.save();
		await cart.populate("items.furnitureId", "name description price image");

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

		if (!cart) return res.status(404).json({ error: "Cart not found!" });

		cart.items = cart.items.filter(
			(item) => item.furnitureId.toString() !== furnitureId
		);

		// Update totals
		cart.count = cart.items.reduce((total, item) => total + item.quantity, 0);
		cart.totalAmount = await calculateTotalAmount(cart.items);

		await cart.save();
		await cart.populate("items.furnitureId", "name description price image");

		res
			.status(200)
			.json({ message: "Item removed from cart successfully", cart });
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
			total += item.price * item.quantity;
		}
	}
	return total;
}
