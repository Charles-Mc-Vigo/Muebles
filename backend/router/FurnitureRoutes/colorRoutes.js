const express = require('express');
const { getColors, addColor, editColor } = require('../../controllers/FurnitureControllers/colorController');
const router = express.Router();

router.get('/',getColors);
router.post('/add',addColor);
router.put('/edit-color/:colorId',editColor);

module.exports = router;