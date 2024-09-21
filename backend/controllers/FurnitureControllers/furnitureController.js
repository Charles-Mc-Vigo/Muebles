const Furniture = require("../../models/Furniture/furnitureModel");
const Category = require('../../models/Furniture/categoryModel');
const { FurnitureSchemaValidator } = require("../../middlewares/JoiSchemaValidation");
const multer = require('multer');
const FurnitureType = require("../../models/Furniture/furnitureTypeModel");
const Material = require("../../models/Furniture/materialsModel");

// Multer setup for handling image uploads in memory
const upload = multer({ storage: multer.memoryStorage() });


// Get all furnitures or furniture by ID
exports.getAllFurnitures = async (req, res) => {
	try {
		const { id } = req.query;

		// Check if 'id' is provided in the query to fetch a specific furniture
		if (id) {
			const existingFurniture = await Furniture.findById(id);
			
			if (!existingFurniture) {
				return res.status(404).json({ message: "Furniture not found!" });
			}

			return res.status(200).json(existingFurniture);
		}

		// If no 'id', fetch all furnitures
		const furnitures = await Furniture.find(req.query);
		if (furnitures.length === 0) {
			return res.status(404).json({ message: "No furniture found!" });
		}
		
		res.status(200).json(furnitures);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error!" });
	}
};


// Create furniture
exports.createFurniture = [upload.single('image'), async (req, res) => {
	try {
    let image;

    if (req.file) {
      image = req.file.buffer.toString('base64');

    } else if (req.body.image) {
      image = req.body.image;
    } else {

      return res.status(400).json({ message: 'No image provided!' });
    }

			const { category, furnitureType, description, material, price } = req.body;

			let missingFields = [];

			if (!category) missingFields.push("category");
			if (!furnitureType) missingFields.push("furnitureType");
			if (!description) missingFields.push("description");
			if (!material) missingFields.push("material");
			if (!price) missingFields.push("price");

			if (missingFields.length > 0) {
				return res.status(400).json({
					message: `The following fields are required: ${missingFields.join(", ")}`
				});
			}

			// Find the category by name to get its ObjectId
			const existingCategory = await Category.findOne({ name: category });
			if (!existingCategory) {
					return res.status(400).json({ message: "Invalid category!" });
			}

			// Find the category by name to get its ObjectId
			const existingFurnitureType = await FurnitureType.findOne({ name: furnitureType });
			if (!existingFurnitureType) {
					return res.status(400).json({ message: "Invalid furniture type!" });
			}

						// Find the category by name to get its ObjectId
			const existingMaterials = await Material.findOne({ name: material });
			if (!existingMaterials) {
					return res.status(400).json({ message: "Invalid material type!" });
			}


			const newFurniture = new Furniture({
				image,
				category:existingCategory.name,
				furnitureType:existingFurnitureType.name,
				description,
				material,
				price,
			});

			await newFurniture.save();
			res.status(201).json({
				message: 'New furniture is added successfully!',
				furniture: newFurniture,
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Server error!', error: error.message });
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




