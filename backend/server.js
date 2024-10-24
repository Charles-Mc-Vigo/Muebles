require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


//furnitures
const furnitureRoutes = require("./router/FurnitureRoutes/furnitureRoutes");
const categoryRoutes = require("../backend/router/FurnitureRoutes/categoryRoutes")
const furnitureTypeRoutes = require('../backend/router/FurnitureRoutes/furnitureTypeRoutes')
const materialsRoutes = require('./router/FurnitureRoutes/materialsRoutes')
const colorRoutes = require('../backend/router/FurnitureRoutes/colorRoutes');
const sizeRoutes = require('../backend/router/FurnitureRoutes/sizeRoutes');
const stocksRoutes = require('../backend/router/FurnitureRoutes/stocksRoutes');

//Users
const userRoutes = require('../backend/router/User/userRoutes')

const adminRoutes = require('./router/Admin/adminRoutes')
const orderRoutes = require('../backend/router/Order/orderRoutes');

//Cart
const cartRoutes = require('./router/Cart/cartRoutes');
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

// Middlewares
app.use(express.json());
app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true,
}));
app.use(cookieParser())
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.use(bodyParser.json());

// Routes
// app.use("/",(req,res)=>{
// 	console.log('Welcome to Muebles!');
// 	res.json({message:"Welcome to Muebles!"})
// })

app.use("/api/users", userRoutes);

//Furnitures maintainance
app.use("/api/furnitures", furnitureRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/furniture-types", furnitureTypeRoutes);
app.use("/api/materials",materialsRoutes)
app.use("/api/colors",colorRoutes)
app.use("/api/sizes",sizeRoutes)
app.use("/api/stocks",stocksRoutes)

// Cart
app.use('/api/carts', cartRoutes);


app.use("/api/admin", adminRoutes);

app.use("/api/orders", orderRoutes);

module.exports = app;
