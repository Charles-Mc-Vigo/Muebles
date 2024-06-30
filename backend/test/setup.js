require("dotenv").config();
const mongoose = require("mongoose");
const app = require("../server");
// const { MongoMemoryServer } = require("mongodb-memory-server");
// let mongodb;

// exports.connect = async () => {
//   mongodb = await MongoMemoryServer.create();
//   const uri = mongodb.getUri();
//   await mongoose.connect(uri);
// };

// exports.disconnect = async () => {
//   await mongoose.disconnect();
//   await mongodb.stop();
// };
let server;
const TestDB = process.env.TEST_DB;

exports.connect = async () => {
  try {
    await mongoose.connect(TestDB);
    console.log("Connected to the test database!");
    server = app.listen(process.env.TEST_PORT || 5000,()=>{
      console.log("Server is running on test port!")
    })
  } catch (error) {
    console.error("Error connecting to the test database:", error);
  }
};

exports.disconnect = async () => {
  try {
    if(server){
      server.close(()=>{
      console.log("Test port terminated.");
    })
  }
    await mongoose.disconnect();
    console.log("Disconnected from the test database!");
  } catch (error) {
    console.error("Error disconnecting from the test database:", error);
  }
};