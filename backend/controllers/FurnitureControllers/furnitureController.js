const Furniture = require("../../models/Furniture/furnitureModel");
const Category = require("../../models/Furniture/categoryModel");
const multer = require("multer");
const mongoose = require("mongoose");
const FurnitureType = require("../../models/Furniture/furnitureTypeModel");
const Materials = require("../../models/Furniture/materialsModel");
const Colors = require("../../models/Furniture/colorModel");
const Size = require("../../models/Furniture/sizeModel");
const User = require("../../models/User/userModel");
const Rating = require('../../models/Rating/ratingModel');


// Multer setup for handling image uploads in memory
const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 50 * 1024 * 1024,
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Not an image! Please upload only images."), false);
		}
	},
}).array("images");

exports.createFurniture = async (req, res) => {
	upload(req, res, async (err) => {
		if (err instanceof multer.MulterError) {
			return res.status(400).json({ message: err.message });
		} else if (err) {
			return res.status(500).json({ message: err.message });
		}

		try {
			let images = [];
			if (req.files && req.files.length > 0) {
				images = req.files.map((file) => file.buffer.toString("base64"));
			} else if (req.body.images) {
				images = req.body.images;
			}

			const {
				category,
				furnitureType,
				name,
				description,
				materials,
				colors,
				sizes,
				price,
			} = req.body;

			// Validation for required fields
			let missingFields = [];
			if (!category) missingFields.push("category");
			if (!furnitureType) missingFields.push("furnitureType");
			if (!description) missingFields.push("description");
			if (!name) missingFields.push("name");
			if (!materials || materials.length === 0) missingFields.push("materials");
			if (!colors || colors.length === 0) missingFields.push("colors");
			if (!sizes || sizes.length === 0) missingFields.push("sizes");
			if (missingFields.length > 0) {
				return res.status(400).json({
					message: `The following fields are required: ${missingFields.join(
						", "
					)}`,
				});
			}

			// Validate and find existing Category, FurnitureType, Materials, Colors
			const existingCategory = await Category.findById(category);
			if (!existingCategory) {
				return res.status(404).json({ message: "Category not found!" });
			}
			console.log(existingCategory._id);

			const existingFurnitureType = await FurnitureType.findById(furnitureType);
			if (!existingFurnitureType) {
				return res.status(404).json({ message: "Furniture type not found!" });
			}

			const existingMaterials = await Materials.find({
				name: { $in: materials },
				furnitureTypeId: existingFurnitureType._id,
			});
			if (existingMaterials.length !== materials.length) {
				// console.log(existingMaterials);
				return res.status(400).json({
					message: `Some materials for ${existingFurnitureType.name} is invalid!`,
				});
			}

			const existingSizes = await Size.find({
				label: { $in: sizes },
				furnitureTypeId: existingFurnitureType._id,
			});
			if (existingSizes.length !== sizes.length) {
				return res.status(400).json({
					message: `Some sizes for ${existingFurnitureType.name} is invalid!`,
				});
			}

			const existingColors = await Colors.find({ name: { $in: colors } });
			if (existingColors.length !== colors.length) {
				return res.status(400).json({ message: "Some colors are invalid!" });
			}

			// Create new furniture item
			const newFurniture = new Furniture({
				images,
				category: existingCategory._id,
				furnitureType: existingFurnitureType._id,
				name,
				description,
				materials: existingMaterials.map((material) => material._id),
				colors: existingColors.map((color) => color._id),
				sizes: existingSizes.map((size) => size._id),
				price,
			});

			await newFurniture.save();
			res.status(201).json({
				message: "New furniture added successfully!",
				newFurniture,
			});

			// console.log(newFurniture)
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Server error!", error: error.message });
		}
	});
};

// Get all furnitures or furniture by ID
exports.getAllFurnitures = async (req, res) => {
	try {
		const furnitures = await Furniture.find({ isArchived: false })
			.populate("category") // Populate category if needed
			.populate("furnitureType") // Populate furniture type if needed
			.populate("colors") // Populate colors if needed
			.populate("materials") // Populate materials
			.populate("sizes") // Populate sizes
			.populate("ratings");

		// Return the fetched furnitures
		res.status(200).json(furnitures);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error!" });
	}
};

exports.ArchivedFurnitures = async (req, res) => {
	try {
		const archivedFurnitures = await Furniture.find({
			isArchived: true,
		}).populate([
			{ path: "category", select: "name -_id" },
			{ path: "furnitureType", select: "name -_id" },
			{ path: "materials", select: "name -_id" },
			{ path: "colors", select: "name -_id" },
			{ path: "sizes", select: "label -_id" },
		]);

		if (archivedFurnitures.length === 0) {
			return res.status(400).json({ error: "No archived furnitures found!" });
		}

		res.status(200).json(archivedFurnitures);
	} catch (error) {
		console.error("Error displaying archived furnitures: ", error);
		res.status(500).json({ message: "Server error!" });
	}
};

// Get Furniture By ID
exports.getFurnitureById = async (req, res) => {
	try {
		const { furnitureId } = req.params;
		const furniture = await Furniture.findById(furnitureId)
			.populate("category")
			.populate("furnitureType")
			.populate("colors")
			.populate("materials")
			.populate("sizes")
			.populate("ratings");
		if (!furniture) {
			return res.status(404).json({ error: "Furniture not found!" });
		}

		res.status(200).json(furniture);
	} catch (error) {
		console.error("Error in finding furniture by ID: ", error);
		res.status(500).json({ error: "Server error!" });
	}
};

exports.updateFurniture = async (req, res) => {
	upload(req, res, async (err) => {
		if (err instanceof multer.MulterError) {
			return res.status(400).json({ message: err.message });
		} else if (err) {
			return res.status(500).json({ message: err.message });
		}

		try {
			const { furnitureId } = req.params;
			const furniture = await Furniture.findById(furnitureId);
			if (!furniture) {
				return res.status(404).json({ error: "Furniture not found!" });
			}

			// Handle images
			let images = furniture.images;
			if (req.body.removeImages && Array.isArray(req.body.removeImages)) {
				// Remove specified images
				images = images.filter((img) => !req.body.removeImages.includes(img));
			}

			// Add new images if uploaded
			if (req.files && req.files.length > 0) {
				const newImages = req.files.map((file) =>
					file.buffer.toString("base64")
				);
				images = [...images, ...newImages];
			} else if (req.body.images) {
				if (Array.isArray(req.body.images)) {
					images = [...images, ...req.body.images];
				} else {
					return res.status(400).json({ error: "Images must be an array!" });
				}
			}

			const {
				category,
				furnitureType,
				name,
				description,
				materials,
				colors,
				sizes,
				price,
			} = req.body;

			// Validate and update category
			if (category) {
				const existingCategory = await Category.findById(category);
				if (!existingCategory) {
					return res.status(400).json({ error: "Invalid category!" });
				}
				furniture.category = category;
			}

			// Validate and update furniture type
			if (furnitureType) {
				const existingFurnitureType = await FurnitureType.findById(
					furnitureType
				);
				if (!existingFurnitureType) {
					return res.status(400).json({ error: "Invalid furniture type!" });
				}
				furniture.furnitureType = furnitureType;
			}

			// Validate and update materials
			if (materials) {
				const existingMaterials = await Materials.find({
					_id: { $in: materials },
					furnitureTypeId: furniture.furnitureType,
				});
				if (existingMaterials.length !== materials.length) {
					return res.status(400).json({
						error: `Some materials for the furniture type are invalid!`,
					});
				}
				furniture.materials = materials;
			}

			// Validate and update colors
			if (colors) {
				const existingColors = await Colors.find({ _id: { $in: colors } });
				if (existingColors.length !== colors.length) {
					return res.status(400).json({ error: "Some colors are invalid!" });
				}
				furniture.colors = colors;
			}

			// Validate and update sizes
			if (sizes) {
				const existingSizes = await Size.find({
					_id: { $in: sizes },
					furnitureTypeId: furniture.furnitureType,
				});
				if (existingSizes.length !== sizes.length) {
					return res.status(400).json({
						error: `Some sizes are invalid for the given furniture type.`,
					});
				}
				furniture.sizes = sizes;
			}

			// Update other properties
			furniture.images = images;
			if (name) furniture.name = name;
			if (description) furniture.description = description;
			if (price) furniture.price = price;

			await furniture.save();
			res.status(200).json({
				message: "Furniture updated successfully!",
				furniture,
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Server error!", error: error.message });
		}
	});
};

//archieving furniture
exports.Archived = async (req, res) => {
	try {
		const { furnitureId } = req.params;

		// Validate ObjectId
		if (!mongoose.Types.ObjectId.isValid(furnitureId)) {
			return res.status(400).json({ error: "Invalid furniture ID!" });
		}

		const furniture = await Furniture.findById(furnitureId);
		if (!furniture) {
			return res.status(404).json({ error: "Furniture not found!" });
		}

		furniture.isArchived = true;
		await furniture.save();
		res
			.status(200)
			.json({ success: `${furniture.name} has been archived successfully! `});
	} catch (error) {
		console.error("Error archiving the furniture: ", error);
		res.status(500).json({ error: "Server error!" });
	}
};

exports.UnArchived = async (req, res) => {
	try {
		const { furnitureId } = req.params;

		// Validate ObjectId
		if (!mongoose.Types.ObjectId.isValid(furnitureId)) {
			return res.status(400).json({ error: "Invalid furniture ID!" });
		}

		const furniture = await Furniture.findById(furnitureId);
		if (!furniture) {
			return res.status(404).json({ error: "Furniture not found!" });
		}

		furniture.isArchived = false;

		await furniture.save();
		res
			.status(200)
			.json({ success: `${furniture.name} has been unarchived successfully!` });
	} catch (error) {
		console.error("Error archiving the furniture: ", error);
		res.status(500).json({ error: "Server error!" });
	}
};

exports.checkIfRated = async (req, res) => {
  try {
    const { furnitureId } = req.params;

    // Check if furniture exists
    const furniture = await Furniture.findById(furnitureId);
    if (!furniture) return res.status(404).json({ message: "Furniture not found!" });

    // Check if user exists
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found!" });

    // Check if the user already rated the furniture
    const ratedFurniture = await Rating.find({ user: user._id, furniture: furnitureId });

    if (ratedFurniture) {
      // Mark furniture as rated
      furniture.isRated = true;
      await furniture.save();

      return res.status(200).json({
        rated: true,
				ratedFurniture
      });
    }
    await furniture.save();

    res.status(200).json({ rated: false });
  } catch (error) {
    console.error("Error checking if rated: ", error);
    res.status(500).json({ message: "Server error!" });
  }
};


exports.searchFurnitureByName = async (req, res) => {
	const { query } = req.query; // Retrieve the search query from the query string
	if (!query) {
	  return res.status(400).json({ message: "Search query is required" });
	}
	try {
	  // Use a case-insensitive regex search to find furniture by name
	  const furnitureItems = await Furniture.find({
		name: { $regex: query, $options: 'i' } // 'i' makes the search case-insensitive
	  });
  
	  if (furnitureItems.length === 0) {
		return res.status(404).json({ message: "No furniture items found" });
	  }
  
	  res.json(furnitureItems); // Send back the found furniture items
	} catch (error) {
	  console.error("Error in search:", error);
	  res.status(500).json({ message: "Error searching for furniture", error });
	}
  };