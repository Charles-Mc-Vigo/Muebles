const WalkInOrder = require('../../models/Order/WalkInOrder');

// Create a new walk-in order
const createWalkInOrder = async (req, res) => {
  try {
    const {
      user,
      furniture,
      material,
      color,
      size,
      quantity,
      paymentMethod,
      proofOfPayment,
      paymentOption,
      shippingAddress,
      deliveryMode,
      expectedDelivery,
      subtotal,
      totalAmount,
      shippingFee,
      totalAmountWithShipping,
      partialPayment,
      remainingBalance,
      monthlyInstallment,
      dueDates,
      interest,
      lastPaymentDate,
    } = req.body;

    const walkInOrder = await WalkInOrder.create({
      user,
      furniture,
      material,
      color,
      size,
      quantity,
      paymentMethod,
      proofOfPayment,
      paymentOption,
      shippingAddress,
      deliveryMode,
      expectedDelivery,
      subtotal,
      totalAmount,
      shippingFee,
      totalAmountWithShipping,
      partialPayment,
      remainingBalance,
      monthlyInstallment,
      dueDates,
      interest,
      lastPaymentDate,
    });

    res.status(201).json({ message: "Walk-in order created successfully", walkInOrder });
  } catch (error) {
    console.error("Error creating walk-in order:", error);
    res.status(500).json({ message: "Error creating walk-in order", error: error.message });
  }
};

// Fetch all walk-in orders
const getWalkInOrders = async (req, res) => {
  try {
    const walkInOrders = await WalkInOrder.find();
    res.status(200).json(walkInOrders);
  } catch (error) {
    console.error("Error fetching walk-in orders:", error);
    res.status(500).json({ message: "Error fetching walk-in orders", error: error.message });
  }
};

module.exports = {
  createWalkInOrder,
  getWalkInOrders,
};
