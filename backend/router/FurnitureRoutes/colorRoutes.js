const express = require('express');
const { getColors, addColor, editColor, UnArchivingColor, ArchivedColors, ArchivingColor, getSpecificColor } = require('../../controllers/FurnitureControllers/colorController');
const router = express.Router();

router.get('/',getColors);
router.get('/:colorId',getSpecificColor);
router.post('/add',addColor);
router.get('/archived',ArchivedColors);
router.delete('/archived/:colorId',ArchivingColor);
router.post('/unarchived/:colorId',UnArchivingColor);
router.put('/edit-color/:colorId',editColor);

module.exports = router;