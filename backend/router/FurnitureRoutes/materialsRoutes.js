const express = require('express');
const router = express.Router();
const { getMaterials, addMaterials, ArchivingMaterials, ArchivedMaterials, UnArchivingMaterials, editMaterial, getSpecificMaterial } = require('../../controllers/FurnitureControllers/materialController');
const {checkAdminAuth} = require('../../middlewares/checkAuth');


router.get('/',getMaterials);
router.get('/:materialId',getSpecificMaterial);
router.post('/add', checkAdminAuth, addMaterials);
router.get('/archived',ArchivedMaterials);
router.delete('/archived/:materialId', checkAdminAuth, ArchivingMaterials);
router.post('/urachived/:materialId', checkAdminAuth, UnArchivingMaterials);
router.put('/edit/:materialId', checkAdminAuth, editMaterial);


module.exports = router;