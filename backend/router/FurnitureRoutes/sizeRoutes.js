const express = require('express');
const { getSizes, addSize } = require('../../controllers/FurnitureControllers/sizeController');
const router = express.Router();

router.get('/',getSizes);
router.post('/add',addSize);

module.exports = router;