const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.ObjectId,
    ref:"User",
    required: true
  },
  furnituresId:[{
    type:mongoose.Schema.ObjectId,
    ref:"Furniture",
    required:true
  }],
  quantity:{
    type:Number,
    required:true
  },
  orderDate:{
    type: Date,
    default: Date.now
  },
  orderStatus: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    default: "Pending"
  }
},{
  timestamps:true
})

const Order = mongoose.model("Order",orderSchema);
module.exports = Order;