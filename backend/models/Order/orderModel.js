const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		orderNumber: {
			type: String,
			unique: true,
		},
		items: [
			{
				furniture: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Furniture",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				price: {
					type: Number,
					required: true,
				},
				material: { type: String },
				color: { type: String },
				size: { type: String },
			},
		],
		shippingAddress: {
			streetAddress: String,
			municipality: String,
			barangay: String,
			zipCode: Number,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		paymentMethod: {
			type: String,
			enum: ["COD", "GCash", "Maya"],
			required: true,
		},
		proofOfPayment: {
			type: String,
			required: true,
		},
		orderStatus: {
			type: String,
			enum: ["pending", "confirmed", "delivered", "cancelled"],
			default: "pending",
		},
		subtotal: Number,
		shippingFee: Number,
		totalAmount: Number,
	},
	{
		timestamps: true,
	}
);

// Generate simple order number
orderSchema.pre("save", async function (next) {
	if (!this.orderNumber) {
		const date = new Date();
		const randomNum = Math.floor(Math.random() * 10000)
			.toString()
			.padStart(4, "0");
		this.orderNumber = `ORD-${date.getFullYear()}${randomNum}`;
	}
	next();
});

orderSchema.statics.createFromCart = async function(cartId, paymentMethod, proofOfPayment, shippingAddress, shippingFee) {
  const cart = await mongoose.model('Cart').findById(cartId)
      .populate('userId')
      .populate('items.furnitureId');
  if (!cart) throw new Error('Cart not found');

  const orderData = {
      user: cart.userId._id,
      items: cart.items.map(item => ({
          furniture: item.furnitureId._id,
          quantity: item.quantity,
          price: item.furnitureId.price,
          material: item.material,
          color: item.color,
          size: item.size,
      })),
      shippingAddress: shippingAddress,
      phoneNumber: cart.userId.phoneNumber,
      paymentMethod: paymentMethod,
      subtotal: cart.totalAmount,
      shippingFee: shippingFee, // Use passed shipping fee
      totalAmount: cart.totalAmount + shippingFee,
      proofOfPayment: proofOfPayment
  };

  return this.create(orderData);
};


// // Static method to create direct order
// orderSchema.statics.createDirectOrder = async function(orderData) {
//   // Validate required fields
//   if (!orderData.userId || !orderData.items || !orderData.paymentMethod) {
//     throw new Error('Missing required fields');
//   }
//   // Fetch user details
//   const user = await mongoose.model('User').findById(orderData.userId);
//   if (!user) throw new Error('User not found');

//   // Use the first address in the user's addresses array
//   const userAddress = user.addresses[]; // Adjust this as necessary
//   const shippingFee = shippingFees[userAddress.municipality] || 0; // Default to 0 if not found

//   // Fetch furniture details and validate stock
//   const furniturePromises = orderData.items.map(async (item) => {
//     const furniture = await mongoose.model('Furniture').findById(item.furnitureId);
//     if (!furniture) throw new Error(`Furniture with ID ${item.furnitureId} not found`);
//     if (furniture.stockQuantity < item.quantity) {
//       throw new Error(`Insufficient stock for furniture: ${furniture.name}`);
//     }
//     return {
//       furniture: furniture._id,
//       quantity: item.quantity,
//       material: item.material,
//       color: item.color,
//       size: item.size,
//       price: furniture.price
//     };
//   });
//   const processedItems = await Promise.all(furniturePromises);

//   // Calculate totals
//   const subtotal = processedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const totalAmount = subtotal + shippingFee;

//   // Prepare order document
//   const order = {
//     user: user._id,
//     items: processedItems,
//     shippingAddress: orderData.shippingAddress || {
//       streetAddress: userAddress.streetAddress,
//       municipality: userAddress.municipality,
//       barangay: userAddress.barangay,
//       zipCode: userAddress.zipCode
//     },
//     phoneNumber: orderData.phoneNumber || user.phoneNumber,
//     paymentMethod: orderData.paymentMethod,
//     proofOfPayment: orderData.proofOfPayment,
//     subtotal,
//     shippingFee,
//     totalAmount
//   };

//   // Create and return the order
//   return this.create(order);
// };

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
