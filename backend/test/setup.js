const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
let mongodb;

exports.connect = async () => {
  mongodb = await MongoMemoryServer.create();
  const uri = mongodb.getUri();
  await mongoose.connect(uri);
};

exports.disconnect = async () => {
  await mongoose.disconnect();
  await mongodb.stop();
};
