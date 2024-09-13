const express = require("express");
const router = express.Router();
const {createFurniture,getAllFurnitures, getFurnitureById, editFurnitureById, deleteFurnitureById, getFurnitureByCategory} = require("../controllers/furnitureController");
// const adminOnly = require("../middlewares/adminOnly");


// router.use(adminOnly)
//create new furniture
//POST - /api/furnitures/create
router.post("/add-furniture",createFurniture);

//get all furnitures
//GET - /api/furnitures 
router.get("/",getAllFurnitures);

//edit furniture
//PUT - /api/furnitures/:id
router.put("/furniture/:id",editFurnitureById);

//delete furniture by id
//DELETE - /api/furnitures/:id
router.delete("/furniture/:id",deleteFurnitureById);

module.exports = router;
