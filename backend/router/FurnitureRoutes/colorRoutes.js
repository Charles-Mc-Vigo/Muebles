const express = require('express');
const { getColors, addColor, editColor, UnArchivingColor, ArchivedColors, ArchivingColor, getSpecificColor } = require('../../controllers/FurnitureControllers/colorController');
const router = express.Router();
const {checkAdminAuth} = require('../../middlewares/checkAuth');


router.get('/',getColors);
router.get('/:colorId',getSpecificColor);
router.post('/add', checkAdminAuth, addColor);
router.get('/archived',ArchivedColors);
router.delete('/archived/:colorId', checkAdminAuth, ArchivingColor);
router.post('/unarchived/:colorId', checkAdminAuth, UnArchivingColor);
router.put('/edit-color/:colorId', checkAdminAuth, editColor);

module.exports = router;