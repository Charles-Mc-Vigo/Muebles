const express = require("express");
const router = express.Router();

const {
    createFurniture,
    getAllFurnitures,
    getFurnitureById,
    updateFurniture,
    Archived,
    UnArchived,
    ArchivedFurnitures,
} = require("../../controllers/FurnitureControllers/furnitureController");

const {checkAdminAuth} = require('../../middlewares/checkAuth');

// Get all furnitures
// GET - /api/furnitures
router.get("/", getAllFurnitures);

// Get all archived furnitures
// GET - /api/furnitures/archived
router.get("/archived", checkAdminAuth, ArchivedFurnitures);

// Create new furniture
// POST - /api/furnitures/add
router.post("/add", checkAdminAuth, createFurniture);

// Update furniture
// PUT - /api/furnitures/edit/:furnitureId
router.put("/edit/:furnitureId", checkAdminAuth, updateFurniture);

// Archive furniture
// DELETE - /api/furnitures/archive/:furnitureId
router.delete("/archive/:furnitureId", checkAdminAuth, Archived);

// UnArchive furniture
// POST - /api/furnitures/unarchive/:furnitureId
router.post("/unarchive/:furnitureId", checkAdminAuth, UnArchived);

// Get furniture by ID (placed last to avoid conflicts)
// GET - /api/furnitures/:furnitureId
router.get("/:furnitureId", getFurnitureById);

module.exports = router;
