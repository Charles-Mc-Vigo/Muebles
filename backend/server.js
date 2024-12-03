require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const scheduleInterestJob = require("./jobs/applyInterestJob");


// Router imports
const authCheckRouter = require('./router/authCheck');
const furnitureRoutes = require("./router/FurnitureRoutes/furnitureRoutes");
const categoryRoutes = require("../backend/router/FurnitureRoutes/categoryRoutes");
const furnitureTypeRoutes = require('../backend/router/FurnitureRoutes/furnitureTypeRoutes');
const materialsRoutes = require('./router/FurnitureRoutes/materialsRoutes');
const colorRoutes = require('../backend/router/FurnitureRoutes/colorRoutes');
const sizeRoutes = require('../backend/router/FurnitureRoutes/sizeRoutes');
const searchRoutes = require ('./router/FurnitureRoutes/searchRoutes');

// User routes
const userRoutes = require('../backend/router/User/userRoutes');

// Admin and other routes
const adminRoutes = require('./router/Admin/adminRoutes');
const orderRoutes = require('../backend/router/Order/orderRoutes');

// Cart routes
const cartRoutes = require('./router/Cart/cartRoutes');

// Rating router
const ratingRoutes = require('./router/Rating/ratingRoutes');

// Database connection
const connectDB = require("./database/db");

const app = express();

const prodServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server is running...");
    });
  } catch (error) {
    console.error("Error starting the server!", error.message);
  }
};

// Start the server in production or development
prodServer();
scheduleInterestJob();


// Middlewares
app.use(express.json({ limit: '50mb' }));  // Increase limit as necessary
app.use(express.urlencoded({ limit: '50mb', extended: true }));  // Allow larger payloads
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',  // Adjust based on your frontend URL
  credentials: true,
}));

// Routes
app.use(authCheckRouter);
app.use("/api/users", userRoutes);
app.use("/api/furnitures", furnitureRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/furniture-types", furnitureTypeRoutes);
app.use("/api/materials", materialsRoutes);
app.use("/api/colors", colorRoutes);
app.use("/api/sizes", sizeRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/ratings',ratingRoutes);
app.use("/api/search", searchRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(500).json({
      error: { message: "Server error: " + err.message },
    });
  }
  next();
});

module.exports = app;
