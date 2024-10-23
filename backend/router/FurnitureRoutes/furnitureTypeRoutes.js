const express = require("express");
const router = express.Router();
const {AddFurnitureType, getFurTypeById,GetFurnitureType, getFurniTypesbyCategoryId} = require('../../controllers/FurnitureControllers/furnitureTypeController');
const {checkAdminAuth} = require('../../middlewares/checkAuth');


router.get('/',GetFurnitureType)
router.post('/add', checkAdminAuth, AddFurnitureType);
router.get('/:furnitypeId', getFurTypeById)
router.get('/category/:categoryId',getFurniTypesbyCategoryId)

//put and delete operation missing

module.exports = router;