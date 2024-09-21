const express = require("express");
const router = express.Router();
const {AddFurnitureType} = require('../../controllers/FurnitureControllers/furnitureTypeController');
const { GetFurnitureType } = require("../../controllers/FurnitureControllers/furnitureTypeController");

router.get('/',GetFurnitureType)
router.post('/add', AddFurnitureType);

module.exports = router;