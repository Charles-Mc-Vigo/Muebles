const express = require('express');
const { AddCategory, getCategory } = require('../../controllers/FurnitureControllers/categoryController');
const router = express.Router();

router.get('/',getCategory)
router.post('/add',AddCategory);


module.exports = router;