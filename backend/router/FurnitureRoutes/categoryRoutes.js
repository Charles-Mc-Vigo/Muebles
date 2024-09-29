const express = require('express');
const { AddCategory, getCategory, getCategoryById } = require('../../controllers/FurnitureControllers/categoryController');
const router = express.Router();

router.get('/',getCategory)
router.post('/add',AddCategory);
router.get('/:id',getCategoryById);


module.exports = router;