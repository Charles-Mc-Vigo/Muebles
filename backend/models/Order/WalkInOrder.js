const mongoose = require("mongoose");

const walkInOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    furniture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Furniture", 
    },
    material: { 
      type: String, 
      required: true 
    },
    color: { 
      type: String, 
      required: true 
    },
    size: { 
      type: String, 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true, 
      min: 1 
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
        ECT: { type: Number },
      },
    ],
    shippingAddress: {
      streetAddress: { type: String, required: true },
      municipality: { type: String, required: true },
      barangay: { type: String, required: true },
      zipCode: { type: Number, required: true },
    },
    phoneNumber: { 
      type: String, 
      required: true 
    },
    paymentOption: { 
      type: String, 
      enum: ["Full Payment", "Partial Payment"], 
      required: true 
    },
    paymentMethod: { 
      type: String, 
      enum: ["GCash", "Maya"], 
      required: true 
    },
    proofOfPayment: { 
      type: String, 
      required: true 
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "delivered",
        "cancelled",
        "out for delivery",
        "repaired",
        "failed delivery",
      ],
      default: "pending",
    },
    deliveryMode: { 
      type: String, 
      required: true 
    },
    expectedDelivery: { 
      type: String, 
      required: true 
    },
    subtotal: { 
      type: Number, 
      required: true 
    },
    totalAmount: { 
      type: Number, 
      required: true 
    },
    shippingFee: { 
      type: Number, 
      required: true 
    },
    totalAmountWithShipping: { 
      type: Number, 
      required: true 
    },
    partialPayment: { 
      type: Number, 
      min: 0 
    },
    remainingBalance: { 
      type: Number, 
      min: 0 
    },
    monthlyInstallment: { 
      type: Number 
    },
    dueDates: {
      type: [Date],
      default: [],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    interest: { 
      type: Number 
    },
    lastPaymentDate: { 
      type: Date 
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    repairRequest: {
      status: {
        type: String,
        default: "not set",
      },
      reason: { 
        type: String 
      },
      requested: {
        type: Boolean,
        default: false,
      },
    },
    type: {
      type: String,
      enum: ["Cart", "Pre-Order"],
      required: true,
    },
    isCustomization: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Order number generation
walkInOrderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    this.orderNumber = `ORD-${date.getFullYear()}${randomNum}`;
  }
  next();
});

// Pre-save hook to calculate subtotal and totalAmountWithShipping
walkInOrderSchema.pre("save", function (next) {
  if (this.isNew || this.isModified('items')) {
    this.subtotal = this.items.reduce(
      (acc, item) => acc + (item.price * item.quantity),
      0
    );
    // Ensure totalAmountWithShipping is calculated properly
    this.totalAmountWithShipping = this.totalAmount + this.shippingFee;
  }
  next();
});

// Pre-save hook for Partial Payment logic
walkInOrderSchema.pre("save", function (next) {
  if (this.paymentOption === "Partial Payment") {
    if (this.remainingBalance <= 0) {
      throw new Error("Remaining balance must be greater than zero for partial payment.");
    }
    if (this.dueDates.length === 0) {
      const now = new Date();
      this.dueDates = [
        new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()),
        new Date(now.getFullYear(), now.getMonth() + 2, now.getDate()),
        new Date(now.getFullYear(), now.getMonth() + 3, now.getDate()),
      ];
    }
  }
  next();
});

// Static method to create a walk-in order
walkInOrderSchema.statics.walkInOrder = async function (
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
  dueDates,
  interest,
  lastPaymentDate
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
    expectedDelivery,
    subtotal,
    totalAmount,
    shippingFee,
    totalAmountWithShipping,
    type: "Pre-Order",
  };

  // Payment logic
  if (paymentOption === "Full Payment") {
    orderData = {
      ...orderData,
      partialPayment: undefined,
      remainingBalance: undefined,
      monthlyInstallment: undefined,
      interest: undefined,
      lastPaymentDate: undefined,
      isPaid: true,
    };
  } else if (paymentOption === "Partial Payment") {
    orderData = {
      ...orderData,
      partialPayment,
      remainingBalance,
      monthlyInstallment,
      dueDates,
      interest,
      lastPaymentDate: lastPaymentDate || new Date(),
    };
  }

  // Ensure totalAmountWithShipping is calculated if not provided
  if (!totalAmountWithShipping) {
    orderData.totalAmountWithShipping = totalAmount + shippingFee;
  }

  return this.create(orderData);
};

const WalkInOrder = mongoose.model("WalkInOrder", walkInOrderSchema);
module.exports = WalkInOrder;
