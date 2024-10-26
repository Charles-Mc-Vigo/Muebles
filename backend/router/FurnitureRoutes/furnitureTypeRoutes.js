const express = require("express");
const router = express.Router();
const {AddFurnitureType, getFurTypeById,GetFurnitureType, getFurniTypesbyCategoryId, UpdateFurnitype, viewArchivedFurnitypes, ArchiveFurnitype, UnarchiveFurnitype} = require('../../controllers/FurnitureControllers/furnitureTypeController');
const {checkAdminAuth} = require('../../middlewares/checkAuth');


router.get('/',GetFurnitureType)
router.get('/archived',checkAdminAuth,viewArchivedFurnitypes)
router.post('/archive/:furnitypeId',checkAdminAuth, ArchiveFurnitype)
router.post('/unarchive/:furnitypeId',checkAdminAuth, UnarchiveFurnitype)
router.post('/add', checkAdminAuth, AddFurnitureType);
router.get('/:furnitypeId', getFurTypeById)
router.get('/category/:categoryId',getFurniTypesbyCategoryId)
router.put('/:furnitypeId',checkAdminAuth, UpdateFurnitype)

//put and delete operation missing

module.exports = router;