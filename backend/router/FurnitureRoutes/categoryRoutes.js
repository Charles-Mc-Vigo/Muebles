const express = require('express');
const { AddCategory, getCategory, getCategoryById, getAllTypesInCategory, EditCategoryById} = require('../../controllers/FurnitureControllers/categoryController');
const router = express.Router();
const {checkAdminAuth} = require('../../middlewares/checkAuth');

router.get('/',getCategory)
router.post('/add', checkAdminAuth, AddCategory);
router.get('/:id', getCategoryById);
router.put('/:categoryId', checkAdminAuth, EditCategoryById)
router.get('/category/:categoryId',getAllTypesInCategory)

//delete operation missing


module.exports = router;