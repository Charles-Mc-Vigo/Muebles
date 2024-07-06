const express = require("express");
const router = express.Router();
const {createFurniture,getAllFurnitures} = require("../controllers/furnitureController")

//create new furniture
router.post("/create",createFurniture);

//get all furnitures
router.get("/",getAllFurnitures);

module.exports = router;
