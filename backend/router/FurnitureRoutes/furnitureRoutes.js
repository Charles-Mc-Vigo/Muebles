const express = require("express");
const router = express.Router();
const { createFurniture, getAllFurnitures,getFurnitureById } = require("../../controllers/FurnitureControllers/furnitureController");
// const adminOnly = require("../middlewares/adminOnly");

//get all furnitures
//GET - /api/furnitures 
router.get("/",getAllFurnitures);
router.get("/:id",getFurnitureById);

// router.use(adminOnly)
//create new furniture
//POST - /api/furnitures/create
router.post("/add",createFurniture);



module.exports = router;
