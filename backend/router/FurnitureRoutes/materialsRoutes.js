const express = require('express');
const router = express.Router();
const { getMaterials, addMaterials, ArchivingMaterials, ArchivedMaterials, UnArchivingMaterials, editMaterial, getSpecificMaterial } = require('../../controllers/FurnitureControllers/materialController');

router.get('/',getMaterials);
router.get('/:materialId',getSpecificMaterial);
router.post('/add',addMaterials);
router.get('/archived',ArchivedMaterials);
router.delete('/archived/:materialId',ArchivingMaterials);
router.post('/urachived/:materialId',UnArchivingMaterials);
router.put('/edit/:materialId',editMaterial);


module.exports = router;