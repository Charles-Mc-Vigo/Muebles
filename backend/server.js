require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./router/userRoutes");
const furnitureRoutes = require("./router/furnitureRoutes");
const orderRoutes = require("./router/orderRoutes");

const app = express();

//Database connection
const dbConnection = process.env.DBCONNECTION;
mongoose
  .connect(dbConnection)
  .then(() => {
    console.log("Connected to database");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database", err);
  });

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/furnitures", furnitureRoutes);
app.use("/api/orders",orderRoutes);



module.exports = app;