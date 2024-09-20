const express = require("express");
const router = express.Router();
const {createFurniture,getAllFurnitures, editFurnitureById} = require("../../controllers/FurnitureControllers/furnitureController");
// const adminOnly = require("../middlewares/adminOnly");

//get all furnitures
//GET - /api/furnitures 
router.get("/",getAllFurnitures);

// router.use(adminOnly)
//create new furniture
//POST - /api/furnitures/create
router.post("/add-furniture",createFurniture);


//edit furniture
//PUT - /api/furnitures/:id
router.put("/:id",editFurnitureById);


module.exports = router;
