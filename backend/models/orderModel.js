const mongoose = require("mongoose");
const Furniture = require("../models/furnitureModel");

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
    default:0
  },
  totalAmount:{
    type:Number,
    default:0
  },
  currency:{
    type:String,
    enum:["PHP"],
    default:"PHP"
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

//calculate the quantity automatically base on furniture order
orderSchema.pre("save", function (next) {
  this.quantity = this.furnituresId.length;
  next();
});

//calculate the total amount of the order
orderSchema.pre("save", async function (next) {
  try {
    const furnitures = await Furniture.find({ "_id": { $in: this.furnituresId } });
    let total = 0;

    furnitures.forEach((furniture) => {
      total += furniture.price;
    });

    this.totalAmount = total;
    next();
  } catch (error) {
    next(error);
  }
});

const Order = mongoose.model("Order",orderSchema);
module.exports = Order;