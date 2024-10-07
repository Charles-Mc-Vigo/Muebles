const Furniture = require("../../models/Furniture/furnitureModel");
const Materials = require("../../models/Furniture/materialsModel");
const Stocks = require("../../models/Furniture/stocksModel");

exports.addStocks = async (req, res) => {
  try {
    const { stock } = req.body;
    
    // Check if the stock value is provided and is a valid number
    if (stock === undefined || stock === null) {
      return res.status(400).json({ message: "Stock quantity is required!" });
    }

    const newStocks = new Stocks({ stock });
    await newStocks.save();
    
    res.status(201).json({
      message: "Stocks successfully added!",
      stocks: newStocks, // Return the created stock object
    });
  } catch (error) {
    console.error("Error adding stocks: ", error);
    res.status(500).json({ message: "Server error!" });
  }
};


exports.checkStocks = async (req, res) => {
  try {
    const stocks = await Stocks.find();
    
    if (stocks.length === 0) {
      return res.status(404).json({ message: "No stocks found!" });
    }

    res.status(200).json(stocks); // Use 200 for successful GET request
  } catch (error) {
    console.error("Error fetching stocks: ", error);
    res.status(500).json({ message: "Server error!" });
  }
};

exports.checkFurnitureStocks = async (req, res) => {
  try {
    const { furnitureId } = req.params;
    
    // Find the furniture by ID
    const furniture = await Furniture.findById(furnitureId);
    
    // If furniture is not found, return a 404 response
    if (!furniture) return res.status(404).json({ message: "Furniture not found!" });
    
    // Check if the furniture has a stocks reference
    if (!furniture.stocks) return res.status(404).json({ message: "Stocks not found for this furniture!" });
    
    // Find the related stocks based on the furniture's stocks reference
    const furnitureStocks = await Stocks.findById(furniture.stocks);
    
    // If stocks are not found, return a 404 response
    if (!furnitureStocks) return res.status(404).json({ message: "Stocks not found!" });
    
    // Return the furniture stocks
    res.status(200).json(furnitureStocks);
    
  } catch (error) {
    console.log("Error fetching furniture stocks: ", error);
    res.status(500).json({ message: "Server error!" });
  }
};

// Get specific material by ID
exports.checkMaterialStocks = async (req, res) => {
  try {
    const { materialId } = req.params;

    const material = await Materials.findById(materialId);
    if (!material) return res.status(404).json({ message: "Material not found!" });

    return res.status(200).json(material);
  } catch (error) {
    console.log("Error fetching specific material: ", error);
    return res.status(500).json({ message: "Server error!" });
  }
};

exports.checkAllMaterialStocks = async (req, res) => {
  try {
    const materials = await Materials.find({ isArchived: false });
    if (materials.length === 0) {
      return res.status(404).json({ message: "No materials found!" });
    }

    return res.status(200).json(materials);
  } catch (error) {
    console.log("Error fetching materials: ", error);
    return res.status(500).json({ message: "Server error" });
  }
};

