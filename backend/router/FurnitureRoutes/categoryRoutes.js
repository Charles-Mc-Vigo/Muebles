const express = require('express');
const { AddCategory, getCategory, getCategoryById, getAllTypesInCategory, EditCategoryById, viewArchivedCategory, ArchiveCategory, unArchiveCategory} = require('../../controllers/FurnitureControllers/categoryController');
const router = express.Router();
const {checkAdminAuth} = require('../../middlewares/checkAuth');

router.get('/',getCategory)
router.get('/archived',checkAdminAuth,viewArchivedCategory)
router.post('/add', checkAdminAuth, AddCategory);
router.get('/:id', getCategoryById);
router.put('/:categoryId', checkAdminAuth, EditCategoryById)
router.get('/category/:categoryId',getAllTypesInCategory)
router.post('/archive/:categoryId',checkAdminAuth,ArchiveCategory);
router.post('/unarchive/:categoryId',checkAdminAuth,unArchiveCategory);

//delete operation missing


module.exports = router;