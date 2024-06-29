const mongoose = require("mongoose");

beforeAll(async () => {
  const test_dbConnection = process.env.TEST_DB; // Use a test database connection string
  await mongoose.connect(test_dbConnection);
});

afterAll(async () => {
  const collections = await mongoose.connection.db.collections();
  
  for (let collection of collections) {
    await collection.deleteMany({});
  }

  await mongoose.connection.close();
});
