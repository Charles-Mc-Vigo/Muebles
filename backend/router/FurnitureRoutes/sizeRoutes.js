const express = require('express');
const { getSizes, addSize, getSizeById } = require('../../controllers/FurnitureControllers/sizeController');
const router = express.Router();

// Get all sizes or sizes filtered by category
router.get('/:furnitureTypeId?', getSizes); // Optional categoryId param

// Add a new size
router.post('/add', addSize);

// Get a specific size by ID
router.get('/size/:id', getSizeById);

module.exports = router;
