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
  searchFurnitureByName,
} = require("../../controllers/FurnitureControllers/furnitureController");

const { checkAdminAuth } = require("../../middlewares/checkAuth");

// Get all furnitures
// GET - /api/furnitures
router.get("/", getAllFurnitures);

// Get all archived furnitures (Admin only)
// GET - /api/furnitures/archived
router.get("/archived", checkAdminAuth, ArchivedFurnitures);

// Create new furniture (Admin only)
// POST - /api/furnitures
router.post("/add", checkAdminAuth, createFurniture);

// Update existing furniture by ID (Admin only)
// PUT - /api/furnitures/:furnitureId
router.put("/edit/:furnitureId", checkAdminAuth, updateFurniture);

// Archive furniture by ID (Admin only)
// PATCH - /api/furnitures/:furnitureId/archive
router.delete("/archive/:furnitureId", checkAdminAuth, Archived);

// Unarchive furniture by ID (Admin only)
// PATCH - /api/furnitures/:furnitureId/unarchive
router.post("/unarchive/:furnitureId", checkAdminAuth, UnArchived);

// Get furniture by ID
// GET - /api/furnitures/:furnitureId
router.get("/:furnitureId", getFurnitureById);

// Search route for furniture
// Function to handle searching by name
router.get('/search', searchFurnitureByName);







module.exports = router;
