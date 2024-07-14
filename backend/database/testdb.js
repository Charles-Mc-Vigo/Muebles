const mongoose = require("mongoose")

const testDB = async () => {
  try {
    await mongoose.connect(process.env.TEST_DB);
    console.log("Connected to test database!")
  } catch (error) {
    console.error("Error connecting to test database",error.message)
    process.exit(1)
  }
}

module.exports = testDB;