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
  checkIfRated,
} = require("../../controllers/FurnitureControllers/furnitureController");

const { checkAdminAuth, checkUserAuth } = require("../../middlewares/checkAuth");

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

<<<<<<< HEAD
// Search route for furniture
// Function to handle searching by name
router.get('/search', (req, res, next) => {
  console.log("Search route hit with query:", req.query.query);
  next();
}, searchFurnitureByName);
module.exports = router;
=======
router.get('/check-if-rated/:furnitureId', checkUserAuth, checkIfRated);

module.exports = router;
>>>>>>> 26ecce36172239d107d20d6534052955fb7e5358
