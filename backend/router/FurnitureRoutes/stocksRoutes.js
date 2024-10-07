const express = require("express");
const { checkStocks, addStocks, checkFurnitureStocks, checkMaterialStocks, checkAllMaterialStocks } = require("../../controllers/FurnitureControllers/stocksController");
const router = express.Router();

router.get("/",checkStocks);
router.get('/materials',checkAllMaterialStocks)
router.post("/add",addStocks);
router.get('/:furnitureId',checkFurnitureStocks);
router.get('/:materialId',checkMaterialStocks)

module.exports = router;