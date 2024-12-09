const mongoose = require("mongoose");

const furnitureOrderSchema = new mongoose.Schema(
  {
    admin: { // Reference to the admin user placing the order
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model for admins
      required: true,
    },
    name: { // Name of the walk-in customer
      type: String,
      required: true,
    },
    address: { // Address of the walk-in customer
      type: String,
      required: true,
    },
    contact: { // Contact number of the walk-in customer
      type: String,
      required: true,
    },
    orderDetails: { // Details about the order
      type: String,
    },
    productPrice: { // Price of the product
      type: Number,
      required: true,
      min: 0,
    },
    shippingFee: { // Shipping fee if applicable
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: { // Total amount to be paid
      type: Number,
      required: true,
      min: 0,
    },
    balance: { // Remaining balance after payment
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: { // Payment method selected by the customer
      type: String,
      enum: ["e-wallet", "cash"],
      required: true,
    },
    paymentType: { // Payment type (full or partial)
      type: String,
      enum: ["full", "partial"],
      required: true,
    },
    downPayment: { // Down payment amount if applicable
      type: Number,
      min: 0,
    },
    deliveryMethod: { // Delivery method selected
      type: String,
      enum: ["pickup", "deliver"],
      required: true,
    },
    orderDate: { // Date of the order
      type: Date,
      default: Date.now,
    },
    referenceNo: { // Reference number for e-wallet payments
      type: String,
    },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

// Static method to create a furniture order
furnitureOrderSchema.statics.createOrder = async function (data) {
  const orderData = {
    ...data,
  };
  return this.create(orderData);
};

const FurnitureOrder = mongoose.model("FurnitureOrder", furnitureOrderSchema);
module.exports = FurnitureOrder;