const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
      // require: true,
    },
    paymentMethod: {
      type: String,
      enum: ["GCash", "Maya"],
      // required: true,
    },
    proofOfPayment: {
      type: String,
      // required: true,
    },
    referenceNumber:{
      type:String
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "delivered", "cancelled", "out for delivery", "repaired", "failed delivery"],
      default: "pending",
    },
    deliveryMode: {
      type: String,
    },
    expectedDelivery: {
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
    },
    imageUploadOrderStatus:{
      type: String,
      default:"not set"
    },
    subtotal: {
      type: Number,
    },
    totalAmount: {
      type: Number,
      default:0 
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
    dueDates: {
      type: [Date],
      default: [],
    },
    isPaid : {
      type:Boolean,
      default: false
    },
    interest: {
      type: Number
    },
    lastPaymentDate: {
      type: Date,
    },
    isDelivered:{
      type:Boolean,
      default:false
    },
    isConfirmed:{
      type:Boolean,
      default:false
    },
    repairRequest: {
      status: { 
        type: String, 
        default: "not set"
      },
      reason: { 
        type: String
      },
      requested: { 
        type: Boolean, 
        default: false
      }
    },
    type: {
      type: String,
      enum: ["Cart", "Pre-Order","ImageUpload"],
      // required: true,
    },
    isCustomization:{
      type:Boolean,
      default:false
    },
    designImages: {
      type: [String],  // Support multiple image uploads
      required: true,
    },
    
  },
  {
    timestamps: true,
  }
);

// Order number generation
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

orderSchema.pre("save", function (next) {
  if (this.isNew && this.paymentOption === "Partial Payment" && this.dueDates.length === 0) {
    const now = new Date();
    this.dueDates = [
      new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()),
      new Date(now.getFullYear(), now.getMonth() + 2, now.getDate()),
      new Date(now.getFullYear(), now.getMonth() + 3, now.getDate()),
    ];
  }
  next();
});

orderSchema.methods.applyInterest = async function () {
  // Apply interest only if there is a partial payment
  if (this.partialPayment && this.remainingBalance > 0) {
    const currentDate = new Date();
    const monthsOverdue = Math.floor(
      (currentDate - this.lastPaymentDate) / (1000 * 60 * 60 * 24 * 30)
    );
    if (monthsOverdue > 0) {
      for (let i = 0; i < monthsOverdue; i++) {
        this.remainingBalance *= 1 + this.interest;
      }
      this.lastPaymentDate = new Date(
        this.lastPaymentDate.setMonth(
          this.lastPaymentDate.getMonth() + monthsOverdue
        )
      );
      await this.save();
    }
  }
};

orderSchema.statics.createImageUploadOrder = async function (user, designImages, material, quantity, deliveryMode, additionalData = {}) {

  const orderData = {
    user,
    designImages,
    material,
    quantity,  // Ensure quantity is correctly set as a number
    deliveryMode,
    type: "ImageUpload",
    ...additionalData, 
  };

  // Create and save the order
  const newOrder = new this(orderData);
  await newOrder.save();
  return newOrder;
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
  expectedDeliveryObj,
  subtotal,
  totalAmount,
  shippingFee,
  totalAmountWithShipping,
  partialPayment,
  remainingBalance,
  monthlyInstallment,
	dueDate,
	interest,
	lastPaymentDate,
) {
  let orderData = {
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
    expectedDelivery :expectedDeliveryObj,
    subtotal,
    totalAmount,
    shippingFee,
    totalAmountWithShipping,
    type: "Pre-Order",
  };

  if (paymentOption === "Full Payment") {
    // For full payment, exclude partial payment related fields
    orderData = {
      ...orderData,
      partialPayment: undefined,
      remainingBalance: undefined,
      monthlyInstallment: undefined,
      interest: undefined,
      lastPaymentDate: undefined,
      isPaid:true
    };
  } else if (paymentOption === "Partial Payment") {
    // For partial payment, include all relevant fields
    orderData = {
      ...orderData,
      partialPayment,
      remainingBalance,
      monthlyInstallment,
			dueDate,
      interest,
      lastPaymentDate: lastPaymentDate || new Date(),
    };
  }

  return this.create(orderData);
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
  monthlyInstallment,
	dueDate,
	interest,
) {
  const cart = await mongoose
    .model("Cart")
    .findById(cartId)
    .populate("userId")
    .populate("items.furnitureId");

  if (!cart) throw new Error("Cart not found");

  let orderData = {
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
    type: "Cart",
  };

  if (paymentOption === "Full Payment") {
    // For full payment, exclude partial payment related fields
    orderData = {
      ...orderData,
      partialPayment: undefined,
      remainingBalance: undefined,
      monthlyInstallment: undefined,
      interest: undefined,
      lastPaymentDate: undefined,
      isPaid:true
    };
  } else if (paymentOption === "Partial Payment") {
    // For partial payment, include all relevant fields
    orderData = {
      ...orderData,
      partialPayment,
      remainingBalance,
      monthlyInstallment,
			dueDate,
      interest,
      lastPaymentDate: new Date(), // Set current date as last payment date
    };
  }

  return this.create(orderData);
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;