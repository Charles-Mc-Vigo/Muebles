const express = require("express");
const router = express.Router();
const {AddFurnitureType, getFurTypeById,GetFurnitureType, getFurniTypesbyCategoryId} = require('../../controllers/FurnitureControllers/furnitureTypeController');

router.get('/',GetFurnitureType)
router.post('/add', AddFurnitureType);
router.get('/:furnitypeId',getFurTypeById)
router.get('/category/:categoryId',getFurniTypesbyCategoryId)

module.exports = router;