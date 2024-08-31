const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Furniture = require("../models/furnitureModel");
const {OrderSchemaValidator} = require("../middlewares/JoiSchemaValidation")


// Getting all the orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found!" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error!" });
  }
};




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
    existingUser.orders.push(order._id);
    await existingUser.save();

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

    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found!" });
    }

    if (userId) {
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found!" });
      }
      existingOrder.userId = userId;
    }

    if (furnituresId) {
      const existingFurnitures = await Furniture.find({ '_id': { $in: furnituresId } });
      if (existingFurnitures.length !== furnituresId.length) {
        return res.status(404).json({ message: "One or more furniture items not found!" });
      }
      existingOrder.furnituresId = furnituresId;
    }

    const {error} = OrderSchemaValidator.validate({orderStatus})
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    existingOrder.orderStatus = orderStatus;


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
    const order = await Order.findById(id)

    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    res.status(200).json({message: "Order details",orderDetails:order});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error!"})
  }
}


//delete request for specific order
exports.deleteOrderById = async (req,res) =>{
  try {
    const {id} = req.params;
    const order = await Order.findById(id);

    if(!order){
      return res.status(404).json({message:"Order not found!"});
    }

    await Order.deleteOne(id)
    res.status(200).json({message:"Order deleted successfully!"});
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Server error!"});
  }
}

// get orders by orderStatus
exports.getOrdersByStatus = async (req, res) => {
  try {
    const { orderStatus } = req.params;

    if (!["Pending", "Delivered", "Shipped", "Cancelled"].includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status!" });
    }

    const orders = await Order.find({ orderStatus });
    if(orders.length === 0){
      return res.status(404).json({message:`No orders found on ${orderStatus} status`})
    }

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error!" });
  }
};
