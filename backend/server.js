require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./router/userRoutes");
const furnitureRoutes = require("./router/furnitureRoutes");
const orderRoutes = require("./router/orderRoutes");
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

//Database connection
if (process.env.NODE_ENV === "production") {
	prodServer();
}

//error handling
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message,
		},
	});
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/furnitures", furnitureRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;
