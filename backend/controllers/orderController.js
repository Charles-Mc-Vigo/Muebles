const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Furniture = require("../models/furnitureModel");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId').populate('furnituresId');

    if (!orders.length) {
      return res.status(404).json({ message: "No order found!" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error!" });
  }
}

exports.createOrders = async (req, res) => {
  try {
    const { userId, furnituresId, quantity } = req.body;

    if (!userId || !furnituresId || !quantity) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    const existingFurnitures = await Furniture.find({ '_id': { $in: furnituresId } });
    if (existingFurnitures.length !== furnituresId.length) {
      return res.status(404).json({ message: "One or more furniture items not found!" });
    }

    const newOrder = new Order({
      userId,
      furnituresId,
      quantity
    });

    const order = await newOrder.save();

    const orderedFurniture = existingFurnitures.map(furniture => ({
      furnitureId: furniture._id,
      furnitureCategory: furniture.category,
      orderFurniture: furniture.furnitureType
    }));

    res.status(201).json({
      message: "Order created successfully!",
      order,
      user: {
        id: existingUser._id,
        email: existingUser.email
      },
      orderedFurniture
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error!" });
  }
}
