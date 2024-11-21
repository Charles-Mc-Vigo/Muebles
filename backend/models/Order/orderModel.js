const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		furniture: {
			type: Object,
		},
		material: { type: String },
		color: { type: String },
		size: { type: String },
		quantity: { type: Number },
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
				ECT: { type: Number },
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
		},
		paymentOption: {
			type: String,
			require: true,
		},
		paymentMethod: {
			type: String,
			enum: ["GCash", "Maya"],
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
		deliveryMode: {
			type: String,
		},
		expectedDelivery: {
			type: String,
		},
		subtotal: {
			type: Number,
		},
		totalAmount: {
			type: Number,
		},
		shippingFee: {
			type: Number,
		},
		totalAmountWithShipping: {
			type: Number,
		},
		partialPayment: {
			type: Number,
		},
		remainingBalance: {
			type: Number,
		},
		monthlyInstallment: {
			type: Number,
		},
		interest: {
			type: Number,
			default: 0, // Total interest accrued
		},
		lastPaymentDate: {
			type: Date,
			default: Date.now, // Initial date kapag gumawa ng order
		},
		
		type: {
			type: String,
			enum: ["Cart", "Pre-Order"],
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

// order number
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

orderSchema.methods.applyInterest = async function () {
  const currentDate = new Date();
  const monthsOverdue = Math.floor(
    (currentDate - this.lastPaymentDate) / (1000 * 60 * 60 * 24 * 30) // Approx. days in a month
  );

  if (monthsOverdue > 0) {
    for (let i = 0; i < monthsOverdue; i++) {
      this.remainingBalance *= 1 + this.interest; // 3% interest kada buwan
    }

    // Update lastPaymentDate to reflect the interest application
    this.lastPaymentDate = new Date(this.lastPaymentDate.setMonth(this.lastPaymentDate.getMonth() + monthsOverdue));

    await this.save(); // Save changes to the database
  }
};



orderSchema.statics.preOrder = async function (
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
	deliveryMode,
	expectedDelivery,
	subtotal,
	totalAmount,
	shippingFee,
	totalAmountWithShipping,
	partialPayment,
	remainingBalance,
	monthlyInstallment
) {
	// Validation for "Partial Payment"
	if (paymentOption === "Full Payment") {
		remainingBalance = undefined;
		monthlyInstallment = undefined;
		partialPayment = undefined;
	}

	const preOrderData = {
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
		deliveryMode,
		expectedDelivery,
		subtotal,
		totalAmount,
		shippingFee,
		totalAmountWithShipping,
		partialPayment,
		remainingBalance,
		monthlyInstallment,
		type: "Pre-Order",
	};

	return this.create(preOrderData);
};

orderSchema.statics.createFromCart = async function (
	cartId,
	paymentMethod,
	proofOfPayment,
	paymentOption,
	shippingAddress,
	deliveryMode,
	expectedDelivery,
	totalAmount,
	shippingFee,
	totalAmountWithShipping,
	partialPayment,
	remainingBalance,
	monthlyInstallment
) {
	const cart = await mongoose
		.model("Cart")
		.findById(cartId)
		.populate("userId")
		.populate("items.furnitureId");

	if (!cart) throw new Error("Cart not found");

	// Validation for "Partial Payment"
	if (paymentOption === "Full Payment") {
		partialPayment = undefined;
		remainingBalance = undefined;
		monthlyInstallment = undefined;
	}

	const orderData = {
		user: cart.userId._id,
		items: cart.items.map((item) => ({
			furniture: item.furnitureId._id,
			quantity: item.quantity,
			price: item.furnitureId.price,
			material: item.material,
			color: item.color,
			size: item.size,
		})),
		shippingAddress,
		phoneNumber: cart.userId.phoneNumber,
		paymentMethod,
		proofOfPayment,
		paymentOption,
		shippingFee,
		deliveryMode,
		expectedDelivery,
		totalAmount,
		totalAmountWithShipping,
		partialPayment,
		remainingBalance,
		monthlyInstallment,
		type: "Cart",
	};

	return this.create(orderData);
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
