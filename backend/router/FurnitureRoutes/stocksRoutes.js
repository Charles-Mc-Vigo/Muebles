const express = require("express");
const { checkStocks, addStocks, checkFurnitureStocks, checkMaterialStocks, checkAllMaterialStocks } = require("../../controllers/FurnitureControllers/stocksController");
const router = express.Router();
const {checkAdminAuth} = require('../../middlewares/checkAuth');


router.get("/",checkStocks);
router.get('/materials',checkAllMaterialStocks)
router.post("/add", checkAdminAuth, addStocks);
router.get('/:furnitureId',checkFurnitureStocks);
router.get('/:materialId',checkMaterialStocks)

//put and delete is missing

module.exports = router;