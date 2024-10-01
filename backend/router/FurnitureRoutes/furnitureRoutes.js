const express = require("express");
const router = express.Router();
const { 
    createFurniture, 
    getAllFurnitures, 
    getFurnitureById, 
    updateFurniture, 
    Archived, 
    UnArchived,
    ArchivedFurnitures 
} = require("../../controllers/FurnitureControllers/furnitureController");
// const adminOnly = require("../middlewares/adminOnly");

// Get all furnitures
// GET - /api/furnitures 
router.get("/", getAllFurnitures);

// Get all archived furnitures
// GET - /api/furnitures/archived
router.get("/archived", ArchivedFurnitures);

// Create new furniture
// POST - /api/furnitures/add
router.post("/add", createFurniture);

// Update furniture
// PUT - /api/furnitures/:furnitureId
router.put('/:furnitureId', updateFurniture);

// Archive furniture
// DELETE - /api/furnitures/archived/:furnitureId
router.delete('/archived/:furnitureId', Archived);

//UnArchiving the furniture
router.post('/unarchived/:furnitureId', UnArchived);

// Get furniture by ID
// GET - /api/furnitures/:furnitureId
router.get("/:furnitureId", getFurnitureById);

module.exports = router;