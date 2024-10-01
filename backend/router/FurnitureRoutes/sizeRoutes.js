const express = require('express');
const { getSizes, addSize, getSizeById, GetAllSizes } = require('../../controllers/FurnitureControllers/sizeController');
const router = express.Router();

// Get all sizes or sizes filtered by category
router.get('/:furnitureTypeId', getSizes); // Optional categoryId param

// Add a new size
router.post('/add', addSize);

//Get all sizes
router.get('/',GetAllSizes);

// Get a specific size by ID
router.get('/size/:sizeId', getSizeById);

module.exports = router;
