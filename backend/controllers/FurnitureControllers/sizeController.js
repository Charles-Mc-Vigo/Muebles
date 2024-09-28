const Size = require("../../models/Furniture/sizeModel");

// Add a new size
exports.addSize = async (req, res) => {
  try {
    const { label, width, height, depth, furnitureType } = req.body;

    if (!label || !width || !height || !depth || !furnitureType) {
      return res.status(400).json({ message: "All fields are required: label, width, height, depth, and furnitureType." });
    }

    // Check if the size already exists for the category
    const existingSize = await Size.findOne({ label, furnitureType });
    if (existingSize) {
      return res.status(400).json({ message: "This size already exists for the selected category." });
    }

    const newSize = new Size({ label, width, height, depth, furnitureType });
    await newSize.save();
    res.status(201).json({ message: "New size has been added successfully!" });
  } catch (error) {
    console.error("Error adding size:", error);
    res.status(500).json({ message: "Server error!" });
  }
};

// Get all sizes (or by category if categoryId is provided)
exports.getSizes = async (req, res) => {
  try {
    const { furnitureTypeId } = req.params;

    let sizes;
    if (furnitureTypeId) {
      // Fetch sizes for a specific category
      sizes = await Size.find({ furnitureType: furnitureTypeId }).populate('furnitureType');
      if (!sizes.length) {
        return res.status(404).json({ message: "No sizes found for this furniture type." });
      }
    } else {
      // Fetch all sizes
      sizes = await Size.find().populate('furnitureType');
      if (!sizes.length) {
        return res.status(404).json({ message: "No sizes found! Please create one." });
      }
    }

    res.status(200).json(sizes);
  } catch (error) {
    console.error("Error fetching the sizes:", error);
    res.status(500).json({ message: "Server error!" });
  }
};

// Get size by ID
exports.getSizeById = async (req, res) => {
  try {
    const { id } = req.params;

    const size = await Size.findById(id).populate('furnitureType');
    if (!size) {
      return res.status(404).json({ message: "Size not found!" });
    }

    res.status(200).json(size);
  } catch (error) {
    console.error("Error fetching the size:", error);
    res.status(500).json({ message: "Server error!" });
  }
};
