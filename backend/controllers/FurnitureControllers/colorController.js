const Colors = require("../../models/Furniture/colorModel");

// Validate Hex format
const isValidHex = (hex) => {
  const hexRegex = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;
  return hexRegex.test(hex);
};

// Add Color
exports.addColor = async (req, res) => {
  try {
    const { name, hex } = req.body;

    if (!name || !hex) {
      return res.status(400).json({ message: "All fields are required! (name, hex)" });
    }

    if (!isValidHex(hex)) return res.status(400).json({ message: "Invalid hex format!" });

    const newColor = new Colors({ name, hex });
    await newColor.save();

    res.status(201).json({ message: `${newColor.name} is added successfully!`, newColor });
  } catch (error) {
    console.error('Error adding color:', error);
    res.status(500).json({ message: "Server error!" });
  }
};

// Get All Colors
exports.getColors = async (req, res) => {
  try {
    const colors = await Colors.find({ isArchived: false });
    if (colors.length === 0) {
      return res.status(200).json({ message: "No colors found!" });
    }
    res.status(200).json(colors);
  } catch (error) {
    console.error('Error fetching colors:', error);
    res.status(500).json({ message: "Server error!" });
  }
};

// Get Specific Color
exports.getSpecificColor = async (req, res) => {
  try {
    const { colorId } = req.params;
    const color = await Colors.findById(colorId);
    if (!color) return res.status(404).json({ message: "Color not found!" });

    res.status(200).json(color);
  } catch (error) {
    console.error("Error fetching color:", error);
    res.status(500).json({ message: "Server error!" });
  }
};

// Edit Color
exports.editColor = async (req, res) => {
  try {
    const { colorId } = req.params;
    const { name, hex } = req.body;

    if (!name || !hex) {
      return res.status(400).json({ message: "All fields are required! (name, hex)" });
    }

    if (!isValidHex(hex)) return res.status(400).json({ message: "Invalid hex format!" });

    const color = await Colors.findById(colorId);
    if (!color) return res.status(404).json({ message: "Color not found!" });

    if (color.name === name && color.hex === hex) {
      return res.status(400).json({ message: "No changes detected!" });
    }

    color.name = name;
    color.hex = hex;

    await color.save();
    res.status(200).json({ message: `${color.name} updated successfully!`, updatedColor: color });
  } catch (error) {
    console.error("Error editing color:", error);
    res.status(500).json({ message: "Server error!" });
  }
};

// Archive/Unarchive Colors
exports.ArchivingColor = async (req, res) => {
  try {
    const { colorId } = req.params;
    const color = await Colors.findById(colorId);

    if (!color) return res.status(404).json({ message: "Color not found!" });

    color.isArchived = true;
    await color.save();
    res.status(200).json({ message: `${color.name} has been archived successfully!` });
  } catch (error) {
    console.error("Error archiving color:", error);
    res.status(500).json({ message: "Server error!" });
  }
};

exports.UnArchivingColor = async (req, res) => {
  try {
    const { colorId } = req.params;
    const color = await Colors.findById(colorId);

    if (!color) return res.status(404).json({ message: "Color not found!" });

    color.isArchived = false;
    await color.save();
    res.status(200).json({ message: `${color.name} has been unarchived successfully!` });
  } catch (error) {
    console.error("Error unarchiving color:", error);
    res.status(500).json({ message: "Server error!" });
  }
};

// Get Archived Colors
exports.ArchivedColors = async (req, res) => {
  try {
    const archivedColors = await Colors.find({ isArchived: true });
    if (archivedColors.length === 0) {
      return res.status(404).json({ message: "No archived colors found!" });
    }
    res.status(200).json(archivedColors);
  } catch (error) {
    console.error("Error fetching archived colors:", error);
    res.status(500).json({ message: "Server error!" });
  }
};
