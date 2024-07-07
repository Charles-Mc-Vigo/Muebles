const Order = require("../models/orderModel");

exports.getAllOrders = async (req,res) => {
  try {
    const orders = await Order.find({});
    
    //check if there are orders
    if(!orders.length){
      return res.status(404).json({message: "No order found!"})
    }

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error!"})
  }
}

exports.createOrders = async (req,res) => {
  try {
    const {user, orderFurniture, quantity} = req.body;

    //check if user is existing
    if(!user || !orderFurniture || !quantity){
      return res.status(400).json({message:"All fields are required!"})
    }

    const newOrder = new Order({
      user,
      orderFurniture,
      quantity
    })

    const order = await newOrder.save();
    res.status(201).json({message:"Order created successfully!",order})
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error!"})
  }
}