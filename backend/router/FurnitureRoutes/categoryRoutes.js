const express = require('express');
const { AddCategory, getCategory, getCategoryById, getAllTypesInCategory, EditCategoryById} = require('../../controllers/FurnitureControllers/categoryController');
const router = express.Router();

router.get('/',getCategory)
router.post('/add',AddCategory);
router.get('/:id',getCategoryById);
router.put('/:categoryId',EditCategoryById)
router.get('/category/:categoryId',getAllTypesInCategory)


module.exports = router;