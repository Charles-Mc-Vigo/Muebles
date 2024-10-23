const express = require("express");
const router = express.Router();
const multer = require("multer");
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

// Multer setup for handling image uploads in memory
const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB file size limit
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Not an image! Please upload only images."), false);
		}
	},
});

// Get all furnitures
// GET - /api/furnitures
router.get("/", getAllFurnitures);

// Get all archived furnitures
// GET - /api/furnitures/archived
router.get("/archived", checkAdminAuth, ArchivedFurnitures);

// Create new furniture
// POST - /api/furnitures/add
router.post("/add", upload.array("images", 5), checkAdminAuth, createFurniture);

// Update furniture
// PUT - /api/furnitures/:furnitureId
router.put("/edit/:furnitureId", upload.array("images", 5), checkAdminAuth, updateFurniture);

// Archive furniture
// DELETE - /api/furnitures/archived/:furnitureId
router.delete("/archived/:furnitureId", checkAdminAuth, Archived);

// UnArchiving the furniture
router.post("/unarchived/:furnitureId", checkAdminAuth, UnArchived);

// Get furniture by ID
// GET - /api/furnitures/:furnitureId
router.get("/:furnitureId", getFurnitureById);

module.exports = router;
