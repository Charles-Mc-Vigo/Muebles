const mongoose = require("mongoose");
const FurnitureType = require("../../models/Furniture/furnitureTypeModel");
const Category = require("../../models/Furniture/categoryModel");

// Add Furniture Type
exports.AddFurnitureType = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    if (!name || !categoryId) {
      return res.status(400).json({ message: "All fields are required: name, category!" });
    }

    // Validate categoryId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID. Must be a 24-character hex string." });
    }

    // Check if the category exists
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found!" });
    }

    // Check if the furniture type name already exists
    const existingName = await FurnitureType.findOne({ name });
    if (existingName) {
      return res.status(400).json({ message: "Furniture type already exists!" });
    }

    // Create a new furniture type
    const newFurnitureType = new FurnitureType({ name, categoryId});
    await newFurnitureType.save();

    return res.status(201).json({ message: `${newFurnitureType.name} added successfully!` });
  } catch (error) {
    console.log("Error adding furniture type:", error);
    return res.status(500).json({ message: "Server error!" });
  }
};

// Get All Furniture Types
exports.GetFurnitureType = async (req, res) => {
  try {
    const furnitureType = await FurnitureType.find();
    if (furnitureType.length === 0) {
      return res.status(404).json({ message: "No furniture type found!" });
    }

    return res.status(200).json(furnitureType);
  } catch (error) {
    console.log("Error fetching furniture type:", error);
    return res.status(500).json({ message: "Server error!" });
  }
};

// Get Furniture Types by Category ID
exports.getFurniTypesbyCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Validate if the categoryId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID. Must be a 24-character hex string." });
    }

    // Check if the category exists
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found!" });
    }

    // Find all furniture types associated with the category
    const furnitureTypes = await FurnitureType.find({ categoryId: existingCategory._id });

    // Handle if no furniture types are found in this category
    if (furnitureTypes.length === 0) {
      return res.status(404).json({ message: "No furniture types found in this category! Please create one." });
    }

    // Return the furniture types
    return res.status(200).json(furnitureTypes);
  } catch (error) {
    console.log("Error fetching furniture type:", error);
    return res.status(500).json({ message: "Server error!" });
  }
};

// Get Furniture Type by ID
exports.getFurTypeById = async (req, res) => {
  try {
    const { furnitypeId } = req.params;

    // Validate if id is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(furnitypeId)) {
      return res.status(400).json({ message: "Invalid furniture type ID. Must be a 24-character hex string." });
    }

    const furnitureType = await FurnitureType.findById(furnitypeId);
    if (!furnitureType) {
      return res.status(404).json({ message: "Furniture type not found!" });
    }

    return res.status(200).json(furnitureType);
  } catch (error) {
    console.log("Error fetching furniture type:", error);
    return res.status(500).json({ message: "Server error!" });
  }
};
