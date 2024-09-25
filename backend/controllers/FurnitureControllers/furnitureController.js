const Furniture = require("../../models/Furniture/furnitureModel");
const Category = require("../../models/Furniture/categoryModel");
const {
	FurnitureSchemaValidator,
} = require("../../middlewares/JoiSchemaValidation");
const multer = require("multer");
const FurnitureType = require("../../models/Furniture/furnitureTypeModel");
const Materials = require("../../models/Furniture/materialsModel");
const Colors = require("../../models/Furniture/colorModel");

// Multer setup for handling image uploads in memory
const upload = multer({ storage: multer.memoryStorage() }).array("images", 10); // Accept up to 10 images
// Get all furnitures or furniture by ID
exports.getAllFurnitures = async (req, res) => {
	try {
		const query = {};

		// Check if category is provided in the query string
		if (req.query.category) {
			// Find the category by name
			const category = await Category.findOne({ name: req.query.category });
			if (!category) {
				return res.status(404).json({ message: "Category not found!" });
			}
			// Use the ObjectId of the category in the query
			query.category = category._id;
		}

		if (req.query.furnitureType) {
			const furnitureType = await FurnitureType.findOne({
				name: req.query.furnitureType,
			});

			if (!furnitureType) {
				return res.status(404).json({ message: "Furniture type not found!" });
			}
			query.furnitureType = furnitureType._id;
		}

		if (req.query.material) {
			const material = await Materials.findOne({ name: req.query.material });

			if (!material) {
				return res.status(404).json({ message: "Material not found!" });
			}
			query.material = material._id;
		}

		if (req.query.color) {
			const color = await Colors.findOne({ name: req.query.color });

			if (!color) {
				return res.status(404).json({ message: "Color not found!" });
			}
			query.color = color._id;
		}

		const furnitures = await Furniture.find(query || req.query).populate([
			{ path: "category", select: "name -_id" },
			{ path: "furnitureType", select: "name -_id" },
			{ path: "material", select: "name -_id" },
			{ path: "color", select: "name -_id" },
		]);

		if (furnitures.length === 0) {
			return res.status(404).json({ message: "No furniture found!" });
		}

		res.status(200).json(furnitures);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error!" });
	}
};

exports.getFurnitreById = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			res.status(404).json({ message: "Furniture not found!" });
		}
		const furniture = await Furniture.findById(id);
		res.status(200).json(furniture);
	} catch (error) {
		console.log("Erorr in finding furniture by id: ", error);
		res.status(500).json({ message: "Server error!" });
	}
};

// Create furniture
exports.createFurniture = [
	upload, // Use the updated multer configuration
	async (req, res) => {
			try {
					let images = [];
					if (req.files && req.files.length > 0) {
							images = req.files.map(file => file.buffer.toString("base64")); // Convert each image to base64
					} else if (req.body.images) {
							images = JSON.parse(req.body.images); // Assuming images are sent as a JSON array
					} else {
							return res.status(400).json({ message: "No images provided!" });
					}

					const { category, furnitureType, name, color, description, stocks, material, price } = req.body;
					let missingFields = [];
					if (!category) missingFields.push("category");
					if (!furnitureType) missingFields.push("furnitureType");
					if (!description) missingFields.push("description");
					if (!name) missingFields.push("name");
					if (!color) missingFields.push("color");
					if (!stocks) missingFields.push("stocks");
					if (!material) missingFields.push("material");
					if (!price) missingFields.push("price");
					if (missingFields.length > 0) {
							return res.status(400).json({
									message: `The following fields are required: ${missingFields.join(", ")}`,
							});
					}

					// Find the category, furniture type, material, and color
					const existingCategory = await Category.findOne({ name: category });
					const existingFurnitureType = await FurnitureType.findOne({ name: furnitureType });
					const existingMaterials = await Materials.findOne({ name: material });
					const existingColor = await Colors.findOne({ name: color });

					// Check for valid references
					if (!existingCategory) return res.status(400).json({ message: "Invalid category!" });
					if (!existingFurnitureType) return res.status(400).json({ message: "Invalid furniture type!" });
					if (!existingMaterials) return res.status(400).json({ message: "Invalid material type!" });
					if (!existingColor) return res.status(400).json({ message: "Invalid color!" });

					// Create a new furniture item
					const newFurniture = new Furniture({
							images, // Store the array of images
							category: existingCategory._id,
							furnitureType: existingFurnitureType._id,
							name,
							color: existingColor._id,
							description,
							stocks,
							material: existingMaterials._id,
							price,
					});
					await newFurniture.save();

					res.status(201).json({
							message: "New furniture is added successfully!",
							furniture: newFurniture,
					});
			} catch (error) {
					console.error(error);
					res.status(500).json({ message: "Server error!", error: error.message });
			}
	},
];

exports.editFurnitureById = async (req, res) => {
	try {
		const { id } = req.params; // Access ID from URL parameters
		const { image, category, furnitureType, description, price } = req.body;

		// Validate the input data
		const { error } = FurnitureSchemaValidator.validate({
			image,
			category,
			furnitureType,
			description,
			price,
		});

		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}

		// Find furniture by ID
		const existingFurniture = await Furniture.findById(id);

		if (!existingFurniture) {
			return res.status(404).json({ message: "Furniture not found!" });
		}

		// Update fields if present
		if (image) existingFurniture.image = image;
		if (category) existingFurniture.category = category;
		if (furnitureType) existingFurniture.furnitureType = furnitureType;
		if (description) existingFurniture.description = description;
		if (price) existingFurniture.price = price;

		// Save updated furniture
		const modifiedFurniture = await existingFurniture.save();

		// Return success response
		res.status(200).json({
			message: `Changes have been saved!`,
			furniture: modifiedFurniture,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error!" });
	}
};
