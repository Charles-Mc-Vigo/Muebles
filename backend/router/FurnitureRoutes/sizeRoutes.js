const express = require('express');
const { getSizes, addSize, getSizeById, GetAllSizes, ArchiveSize, UpdateSize} = require('../../controllers/FurnitureControllers/sizeController');
const router = express.Router();
const {checkAdminAuth} = require('../../middlewares/checkAuth');

// Get all sizes or sizes filtered by category
router.get('/:furnitureTypeId', getSizes); // Optional categoryId param

// Add a new size
router.post('/add', checkAdminAuth, addSize);

//Get all sizes
router.get('/',GetAllSizes);

// Get a specific size by ID
router.get('/size/:sizeId', checkAdminAuth, getSizeById);

router.post('/archive/:sizeId',checkAdminAuth,ArchiveSize);

router.put('/:sizeId',checkAdminAuth,UpdateSize);




module.exports = router;
