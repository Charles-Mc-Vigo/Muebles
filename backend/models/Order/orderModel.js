const mongoose = require("mongoose");

// const preOrderSchema = new mongoose.Schema({
// 	user: {
// 		type: mongoose.Schema.Types.ObjectId,
// 		ref: "User",
// 		required: true,
// 	},
// 	furniture:{
// 		type:mongoose.Schema.Types.ObjectId,
// 		ref:"Furniture"
// 	},
// 	material:{type:String},
// 	color:{type:String},
// 	size:{type:String},
// 	quantity:{type:Number},
// 	orderNumber: {
// 		type: String,
// 		unique: true,
// 	},
// 	shippingAddress: {
// 		streetAddress: String,
// 		municipality: String,
// 		barangay: String,
// 		zipCode: Number,
// 	},
// 	paymentOption:{
// 		type:String,
// 		require:true,
// 	},
// 	paymentMethod: {
// 		type: String,
// 		enum: ["GCash", "Maya"],
// 		required: true,
// 	},
// 	proofOfPayment: {
// 		type: String,
// 		required: true,
// 	},
// 	orderStatus: {
// 		type: String,
// 		enum: ["pending", "confirmed", "delivered", "cancelled"],
// 		default: "pending",
// 	},
// 	deliveryMode:{
// 		type:String,
// 	},
// 	expectedDelivery:{
// 		type:String
// 	},
// 	subtotal: Number,
// 	shippingFee: Number,
// 	totalAmount: Number,
// },{
// 	timestamps: true,
// })

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
		montlyInstallment: {
			type: Number,
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
		remainingBalance = undefined;
		monthlyInstallment = undefined;
		partialPayment = undefined;
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
