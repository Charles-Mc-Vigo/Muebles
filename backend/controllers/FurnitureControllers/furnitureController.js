const Furniture = require("../../models/Furniture/furnitureModel");
const Category = require("../../models/Furniture/categoryModel");
const multer = require("multer");
const FurnitureType = require("../../models/Furniture/furnitureTypeModel");
const Materials = require("../../models/Furniture/materialsModel");
const Colors = require("../../models/Furniture/colorModel");
const Size = require("../../models/Furniture/sizeModel");


// Multer setup for handling image uploads in memory
const upload = multer({ storage: multer.memoryStorage() }).array("images", 10); // Accept up to 10 images

// Get all furnitures or furniture by ID
exports.getAllFurnitures = async (req, res) => {
  try {
		const furnitures = await Furniture.find()
		if(furnitures.length === 0) return res.status(404).json({messsage:"No furnitures found!"})

    res.status(200).json(furnitures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
};

// Get Furniture By ID
exports.getFurnitureById = async (req, res) => {
  try {
    const { id } = req.params;
    const furniture = await Furniture.findById(id).populate([
      { path: "category", select: "name -_id" },
      { path: "furnitureType", select: "name -_id" },
      { path: "materials", select: "name -_id" },
      { path: "colors", select: "name -_id" },
    ]);

    if (!furniture) {
      return res.status(404).json({ message: "Furniture not found!" });
    }

    res.status(200).json(furniture);
  } catch (error) {
    console.error("Error in finding furniture by ID: ", error);
    res.status(500).json({ message: "Server error!" });
  }
};


// Create Furniture
// Create Furniture
exports.createFurniture = [
  upload, // Use the updated multer configuration
  async (req, res) => {
    try {
      let images = [];
      if (req.files && req.files.length > 0) {
        images = req.files.map(file => file.buffer.toString("base64")); // Convert each image to base64
      } else if (req.body.images) {
        // Ensure the images field is parsed correctly
        if (Array.isArray(req.body.images)) {
          images = req.body.images;
        } else {
          return res.status(400).json({ message: "Images must be an array!" });
        }
      } else {
        return res.status(400).json({ message: "No images provided!" });
      }

      const { category, furnitureType, name, description, stocks, materials, colors, sizes, price } = req.body;

      // Validation
      let missingFields = [];
      if (!category) missingFields.push("category");
      if (!furnitureType) missingFields.push("furnitureType");
      if (!description) missingFields.push("description");
      if (!name) missingFields.push("name");
      if (!materials) missingFields.push("materials");
      if (!colors) missingFields.push("colors");
      if (!stocks) missingFields.push("stocks");
      if (!price) missingFields.push("price");
      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `The following fields are required: ${missingFields.join(", ")}`,
        });
      }

      // Find the category, furniture type, materials, and colors by name
      const existingCategory = await Category.findOne({ name: category });
      const existingFurnitureType = await FurnitureType.findOne({ name: furnitureType });
      const existingMaterials = await Materials.find({ name: { $in: materials } });
      const existingColors = await Colors.find({ name: { $in: colors } });
			const existingName = await Furniture.findOne({name:{$in:name}});
			const existingSize = await Size.findOne({size:sizes});

			if(existingName){
				return res.status(400).json({message: "Furniture name already exists!"});
			}

      // Error handling for missing items
      if (!existingCategory) return res.status(400).json({ message: "Invalid category!" });
      if (!existingFurnitureType) return res.status(400).json({ message: "Invalid furniture type!" });
      if (existingMaterials.length !== materials.length) return res.status(400).json({ message: "Some materials are invalid!" });
      if (existingColors.length !== colors.length) return res.status(400).json({ message: "Some colors are invalid!" });
      if (!existingSize) return res.status(400).json({ message: "Size are invalid!" });

      // Create a new furniture item
      const newFurniture = new Furniture({
        images, // Store the array of images
        category: existingCategory._id,
        furnitureType: existingFurnitureType._id,
        name,
        description,
        stocks,
        materials: existingMaterials.map(material => material._id),
        colors: existingColors.map(color => color._id),
        sizes : existingSize._id,
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


