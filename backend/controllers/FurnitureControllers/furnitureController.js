const Furniture = require("../../models/Furniture/furnitureModel");
const Category = require("../../models/Furniture/categoryModel");
const multer = require("multer");
const mongoose = require('mongoose');
const FurnitureType = require("../../models/Furniture/furnitureTypeModel");
const Materials = require("../../models/Furniture/materialsModel");
const Colors = require("../../models/Furniture/colorModel");
const Size = require("../../models/Furniture/sizeModel");


// Multer setup for handling image uploads in memory
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  },
}).array("images"); // Allow up to 5 image uploads

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
        images = req.files.map(file => file.buffer.toString('base64'));
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
      if (!price) missingFields.push("price");
      if (!sizes || sizes.length === 0) missingFields.push("sizes");
      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `The following fields are required: ${missingFields.join(", ")}`,
        });
      }

      // Validate and find existing Category, FurnitureType, Materials, Colors
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(400).json({ message: "Invalid category!" });
      }

      const existingFurnitureType = await FurnitureType.findById(furnitureType);
      if (!existingFurnitureType) {
        return res.status(400).json({ message: "Invalid furniture type!" });
      }

      const existingMaterials = await Materials.find({ name: { $in: materials } });
      if (existingMaterials.length !== materials.length) {
        return res.status(400).json({ message: "Some materials are invalid!" });
      }

      const existingColors = await Colors.find({ name: { $in: colors } });
      if (existingColors.length !== colors.length) {
        return res.status(400).json({ message: "Some colors are invalid!" });
      }

      const existingSize = await Size.find({
        label: { $in: sizes },
        furnitureTypeId: existingFurnitureType._id,
      });
      if (existingSize.length !== sizes.length) {
        return res.status(400).json({
          message: `Some sizes are invalid for ${existingFurnitureType.name}. Please ensure all sizes are correct.`,
        });
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
        sizes: existingSize.map((size) => size._id),
        price,
      });

      await newFurniture.save();
      res.status(201).json({
        message: "New furniture added successfully!",
        newFurniture,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error!", error: error.message });
    }
  });
};

// Get all furnitures or furniture by ID
exports.getAllFurnitures = async (req, res) => {
	try {
		const furnitures = await Furniture.find().populate([
			{ path: "category", select: "name -_id" },
			{ path: "furnitureType", select: "name -_id" },
			{ path: "materials", select: "name -_id" },
			{ path: "colors", select: "name hex -_id" },
			{ path: "sizes", select: "label height width depth -_id" },
		]);

		
		// Return the fetched furnitures
		res.status(200).json(furnitures);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error!" });
	}
};



exports.ArchivedFurnitures = async (req, res) => {
	try {
			const archivedFurnitures = await Furniture.find({ isArchived: true }).populate([
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
		const furniture = await Furniture.findById(furnitureId).populate([
			{ path: "category", select: "name -_id" },
			{ path: "furnitureType", select: "name -_id" },
			{ path: "materials", select: "name -_id" },
			{ path: "colors", select: "name hex -_id" },
			{ path: "sizes", select: "label -_id" },
		]);

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

      // Preserve existing images
      let images = [...furniture.images];

      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => file.buffer.toString('base64'));
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

      // Find the category, furniture type, materials, and colors by name
      if (category) {
        const existingCategory = await Category.findOne({ name: category });
        if (existingCategory) {
          furniture.category = existingCategory._id;
        } else {
          return res.status(400).json({ error: "Invalid category!" });
        }
      }

      if (furnitureType) {
        const existingFurnitureType = await FurnitureType.findOne({ name: furnitureType });
        if (existingFurnitureType) {
          furniture.furnitureType = existingFurnitureType._id;
        } else {
          return res.status(400).json({ error: "Invalid furniture type!" });
        }
      }

      if (materials) {
        const existingMaterials = await Materials.find({ name: { $in: materials } });
        if (existingMaterials.length !== materials.length) {
          return res.status(400).json({ error: "Some materials are invalid!" });
        }
        furniture.materials = existingMaterials.map((material) => material._id);
      }

      if (colors) {
        const existingColors = await Colors.find({ name: { $in: colors } });
        if (existingColors.length !== colors.length) {
          return res.status(400).json({ error: "Some colors are invalid!" });
        }
        furniture.colors = existingColors.map((color) => color._id);
      }

      if (sizes) {
        const existingSize = await Size.find({ label: { $in: sizes }, furnitureTypeId: furniture.furnitureType });
        if (existingSize.length !== sizes.length) {
          return res.status(400).json({
            error: `Some sizes are invalid for the given furniture type. Please ensure all sizes are correct.`,
          });
        }
        furniture.sizes = existingSize.map((size) => size._id);
      }

      // Update other properties
      furniture.images = images;
      furniture.name = name || furniture.name;
      furniture.description = description || furniture.description;
      furniture.price = price || furniture.price;

      await furniture.save();
      res.status(200).json({
        success: "Furniture updated successfully!",
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
			res.status(200).json({ success: `${furniture.name} has been archived successfully!` });
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
			res.status(200).json({ success: `${furniture.name} has been unarchived successfully!` });
	} catch (error) {
			console.error("Error archiving the furniture: ", error);
			res.status(500).json({ error: "Server error!" });
	}
};