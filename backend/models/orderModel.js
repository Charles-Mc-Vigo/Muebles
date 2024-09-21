const mongoose = require("mongoose");
const Furniture = require("./Furniture/furnitureModel");

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

// Calculate the total amount of the order based on furniture price and quantity
orderSchema.pre("save", async function (next) {
  try {
    const furnitures = await Furniture.find({ "_id": { $in: this.items.map(item => item.furniture) } });
    let total = 0;

    // Calculate total price based on quantity per item
    this.items.forEach((item) => {
      const furniture = furnitures.find(f => f._id.equals(item.furniture));
      if (furniture) {
        total += furniture.price * item.quantity; // Multiply price by quantity
      }
    });

    this.totalAmount = total;
    next();
  } catch (error) {
    next(error);
  }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
