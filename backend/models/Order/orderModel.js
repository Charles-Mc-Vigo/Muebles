const mongoose = require("mongoose");
const Furniture = require("../Furniture/furnitureModel");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      furniture: {
        type: mongoose.Schema.ObjectId,
        ref: "Furniture",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ],
  totalAmount: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    enum: ["PHP"],
    default: "PHP"
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  orderStatus: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    default: "Pending"
  }
}, {
  timestamps: true
});


const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
