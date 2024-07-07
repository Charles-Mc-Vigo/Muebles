const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  user:{
    type: mongoose.Schema.ObjectId,
    ref:"User",
    required: true
  },
  orderfurnitures:[{
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