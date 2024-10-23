const Colors = require("../../models/Furniture/colorModel");

const isValidRGB = (rgb) => {
  const rgbArray = rgb.split(',').map(Number);
  // Check if there are exactly 3 values and each is between 0 and 255
  return rgbArray.length === 3 && rgbArray.every(value => value >= 0 && value <= 255);
};

exports.addColor = async (req, res) => {
  try {
      const { name, rgb, hex } = req.body;

      // Validate required inputs
      if (!name || !rgb || !hex) {
          return res.status(400).json({ message: "All inputs are required! name, rgb, hex" });
      }

      // Validate hex format
      if (!isValidHex(hex)) {
          return res.status(400).json({ message: "Invalid hex format!" });
      }

      // Validate RGB format (assuming it's a string like "255, 0, 0")
      if (!isValidRGB(rgb)) {
          return res.status(400).json({ message: "Invalid RGB format! Use '255, 0, 0' format." });
      }

      const newColor = new Colors({ name, rgb, hex });
      await newColor.save();
      res.status(201).json({ message: `${newColor.name} is added successfully!`, newColor});
  } catch (error) {
      console.log('Error adding color: ', error);
      res.status(500).json({ message: "Server error!" });
  }
};


exports.getColors = async (req, res) => {
  try {
    const colors = await Colors.find({isArchived:false});
    if (colors.length === 0) {
      return res.status(404).json({ message: "No colors found!" });
    }
    res.status(200).json(colors);
  } catch (error) {
    console.log('Error fetching the colors: ', error);
    res.status(500).json({ message: "Server error!" });
  }
}

exports.getSpecificColor = async (req,res) =>{
  try {
    const {colorId} = req.params;
    const color = await Colors.findById(colorId);
    if(!color) return res.status(404).json({message:"Color not found!"});
    res.status(200).json(color);
  } catch (error) {
    console.log("Error getting color using Id: ",error);
    res.status(500).json({message:"Server error!"});
  }
}

exports.ArchivedColors = async (req,res) => {
  try {
    const archivedColors = await Colors.find({isArchived:true});
    if(archivedColors.length === 0) return res.status(404).json({message:"No archived colors found!"});
    res.status(200).json(archivedColors);
  } catch (error) {
    console.log("Error fetching archived color: ",error);
    res.status(500).json({message:"Server error!"})
  }
}

exports.UnArchivingColor = async (req,res) => {
  try {
    const {colorId} = req.params;
    const color = await Colors.findById(colorId);
    if(!color) return res.status(404).json({message:"Color not found!"});
    color.isArchived = false;
    await color.save();
    res.status(200).json({message:`${color.name} has been unarchived successfully!`})
  } catch (error) {
    console.log("Error unarchiving the color: ",error);
    res.status(500).json({message:"Server error!"})
  }
}
exports.ArchivingColor = async (req,res) => {
  try {
    const {colorId} = req.params;
    const color = await Colors.findById(colorId);
    if(!color) return res.status(404).json({message:"Color not found!"});
    color.isArchived = true;
    await color.save();
    res.status(200).json({message:`${color.name} has been archived successfully!`})
  } catch (error) {
    console.log("Error unarchiving the color: ",error);
    res.status(500).json({message:"Server error!"})
  }
}

// Function to validate hex color format
const isValidHex = (hex) => {
  // Regular expression to match hex color codes
  const hexRegex = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;
  return hexRegex.test(hex);
};

exports.editColor = async (req, res) => {
  try {
    const { colorId } = req.params;
    const color = await Colors.findById(colorId);
    if (!color) return res.status(404).json({ message: "Color not found!" });
    
    const { name, rgb, hex } = req.body;
    if (!name || !rgb || !hex) return res.status(400).json({ message: "All fields are required!: name, rgb, hex" });

    // Validate hex and rgb
    if (!isValidHex(hex)) return res.status(400).json({ message: "Invalid hex format!" });
    if (!isValidRGB(rgb)) return res.status(400).json({ message: "Invalid RGB format!" });

    // Check if any changes were made
    if (color.name === name && color.rgb === rgb && color.hex === hex) {
      return res.status(400).json({ message: "No changes made!" });
    }

    // Update the color fields if changes were made
    color.name = name;
    color.rgb = rgb;
    color.hex = hex;

    // Save the updated color
    await color.save();
    res.status(200).json({ message: `${color.name} updated successfully!`,updatedColor:color});
  } catch (error) {
    console.log("Error editing color: ", error);
    res.status(500).json({ message: "Server error!" });
  }
};

exports.archivedColor = async (req, res) => {
  try {
    const { colorId } = req.params;
    const color = await Colors.findById(colorId);

    if(!color){
      res.status(404).json({message:"Color not found!"});
    }

    color.isArchived=true;
    await color.save();

    res.status(200).json({message:`${color.name} is archived successfully!`})
  }
  catch(error){
    console.log("Error achiving color: ",error);
    res.status(500).json({message:"Server error!"})
  }
}