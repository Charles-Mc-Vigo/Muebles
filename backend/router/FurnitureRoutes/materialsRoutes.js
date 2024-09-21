const express = require('express');
const router = express.Router();
const { getMaterials, addMaterials } = require('../../controllers/FurnitureControllers/materialController');

router.get('/',getMaterials);
router.post('/add',addMaterials);

module.exports = router;