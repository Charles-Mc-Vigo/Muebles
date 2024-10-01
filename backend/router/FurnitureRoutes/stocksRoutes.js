const express = require("express");
const { checkStocks, addStocks } = require("../../controllers/FurnitureControllers/stocksController");
const router = express.Router();

router.get("/",checkStocks);
router.post("/add",addStocks);

module.exports = router;