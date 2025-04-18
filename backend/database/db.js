const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.LOCAL_DB);
    console.log("Connected to database!")
  } catch (error) {
    console.error("Error connecting to database", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;