const express = require("express");
const router = express.Router();
const {createFurniture,getAllFurnitures, getFurnitureById, editFurnitureById, deleteFurnitureById, getFurnitureByCategory} = require("../controllers/furnitureController")
const authRoutes = require("../middlewares/authRoutes");


router.use(authRoutes)
//create new furniture
//POST - /api/furnitures/create
router.post("/create",createFurniture);

//get all furnitures
//GET - /api/furnitures 
router.get("/",getAllFurnitures);

//get furnitures by category
//GET - /api/furnitures/:category
router.get("/:category",getFurnitureByCategory)

//get furniture by id
//GET - /api/furnitures/:id
router.get("/:id",getFurnitureById);

//edit furniture
//PUT - /api/furnitures/:id
router.put("/:id",editFurnitureById);

//delete furniture by id
//DELETE - /api/furnitures/:id
router.delete("/:id",deleteFurnitureById);

module.exports = router;
