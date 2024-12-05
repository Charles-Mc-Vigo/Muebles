const cron = require("node-cron");
const Order = require("../models/Order/orderModel"); // Adjust the path as needed

const applyInterestToOverdueOrders = async () => {
  try {
    // Hanapin ang overdue orders
    const overdueOrders = await Order.find({
      remainingBalance: { $gt: 0 },
      type: "Pre-Order",
    });

    // Apply interest sa bawat overdue order
    for (const order of overdueOrders) {
      await order.applyInterest();
    }

    console.log("Interest applied to overdue orders successfully.");
  } catch (error) {
    console.error("Error applying interest to orders:", error);
  }
};

// Schedule the cron job to run daily at midnight
const scheduleInterestJob = () => {
	cron.schedule("0 0 * * *", applyInterestToOverdueOrders);
};

module.exports = scheduleInterestJob;

