const express = require('express');
const { getColors, addColor } = require('../../controllers/FurnitureControllers/colorController');
const router = express.Router();

router.get('/',getColors);
router.post('/add',addColor);

module.exports = router;