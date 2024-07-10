const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Furniture = require("../models/furnitureModel");

//getting all the orders
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

//creating an order
exports.createOrders = async (req, res) => {
  try {
    const { userId, furnituresId} = req.body;

    if (!userId || !furnituresId) {
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
      furnituresId
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

// modify order by id
exports.editOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, furnituresId, orderStatus } = req.body;

    //check existence of the order
    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found!" });
    }

    //also the user
    if (userId) {
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found!" });
      }
      existingOrder.userId = userId;
    }

    //also the ordered furnitures
    if (furnituresId) {
      const existingFurnitures = await Furniture.find({ '_id': { $in: furnituresId } });
      if (existingFurnitures.length !== furnituresId.length) {
        return res.status(404).json({ message: "One or more furniture items not found!" });
      }
      existingOrder.furnituresId = furnituresId;
    }

    //edit order status
    if (orderStatus) {
      existingOrder.orderStatus = orderStatus;
    }

    // save the updated order
    const updatedOrder = await existingOrder.save();

    res.status(200).json({
      message: "Order updated successfully!",
      updatedOrder
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error!" });
  }
}

//find order by id
exports.getOrderById = async (req,res) =>{
  try {
    const {id} = req.params;
    const existingOrder = await Order.findById(id).populate('furnituresId');

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found!" });
    }

    res.status(200).json({message: "Order details",orderDetails:existingOrder});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error!"})
  }
}

//up next!
//delete request for specific order
//joi validation for ordering