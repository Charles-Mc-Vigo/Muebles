const express = require('express');
const { AddCategory, getCategory, getCategoryById, getAllTypesInCategory, EditCategoryById, viewArchivedCategory, ArchiveCategory} = require('../../controllers/FurnitureControllers/categoryController');
const router = express.Router();
const {checkAdminAuth} = require('../../middlewares/checkAuth');

router.get('/',getCategory)
router.post('/add', checkAdminAuth, AddCategory);
router.get('/:id', getCategoryById);
router.put('/:categoryId', checkAdminAuth, EditCategoryById)
router.get('/category/:categoryId',getAllTypesInCategory)
router.get('/archived',checkAdminAuth,viewArchivedCategory)
router.post('/archive/:categoryId',checkAdminAuth,ArchiveCategory);

//delete operation missing


module.exports = router;