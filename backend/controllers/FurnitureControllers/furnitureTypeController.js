const mongoose = require("mongoose");
const FurnitureType = require("../../models/Furniture/furnitureTypeModel");
const Category = require("../../models/Furniture/categoryModel");

exports.AddFurnitureType = async (req, res) => {
  try {
    const { name, ECT, categoryId } = req.body;

    // Check if the category exists by name
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found!" });
    }

    // Check if the furniture type name already exists
    const existingName = await FurnitureType.findOne({ name });
    if (existingName) {
      return res.status(400).json({ message: "Furniture type already exists!" });
    }

    if(!ECT) return res.status(400).json({message:"Estimated Completion Time required!"});


    // Create a new furniture type with the category ID
    const newFurnitureType = new FurnitureType({ name, ECT, categoryId: existingCategory._id });
    await newFurnitureType.save();

    return res.status(201).json({ message:`${newFurnitureType.name} added successfully`, newFurnitureType});
  } catch (error) {
    console.log("Error adding furniture type:", error);
    return res.status(500).json({ message: "Server error!" });
  }
};

// Get All Furniture Types
exports.GetFurnitureType = async (req, res) => {
  try {
    const furnitureType = await FurnitureType.find({isArchived:false});
    if (furnitureType.length === 0) {
      return res.status(200).json({ message: "No furniture type found!" });
    }

    return res.status(200).json(furnitureType);
  } catch (error) {
    console.log("Error fetching furniture type:", error);
    return res.status(500).json({ message: "Server error!" });
  }
};

exports.ArchiveFurnitype = async (req,res) => {
  try {
    const {furnitypeId} = req.params;
    const exisitingFurnitype = await FurnitureType.findById(furnitypeId)
    if(!exisitingFurnitype) return res.status(404).json({message:"Furniture type not found!"});

    exisitingFurnitype.isArchived = true;
    await exisitingFurnitype.save();
    res.status(200).json({message:"Furniture types archived successfully!"})
  } catch (error) {
    console.error("ERror in archiving the furniture types: ",error);
    res.status(500).json({message:"Server error!"});
  }
}

exports.UnarchiveFurnitype = async (req,res) => {
  try {
    const {furnitypeId} = req.params;
    const exisitingFurnitype = await FurnitureType.findById(furnitypeId)
    if(!exisitingFurnitype) return res.status(404).json({message:"Furniture type not found!"});

    exisitingFurnitype.isArchived = false;
    await exisitingFurnitype.save();
    res.status(200).json({message:"Furniture types unarchived successfully!"})
  } catch (error) {
    console.error("ERror in archiving the furniture types: ",error);
    res.status(500).json({message:"Server error!"});
  }
}

exports.viewArchivedFurnitypes = async (req,res) => {
  try {
    const archiveFurnitureTypes = await FurnitureType.find({isArchived:true})
    if(archiveFurnitureTypes.length === 0) return res.status(200).json({message:"No furniture type found in the archive!"});
    res.status(200).json(archiveFurnitureTypes)
  } catch (error) {
    console.error("ERror in archiving the furniture types: ",error);
    res.status(500).json({message:"Server error!"});
  }
}

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

    if(!furnitureType.ECT){
      return furnitureType.ECT = 1;
    }

    return res.status(200).json(furnitureType);
  } catch (error) {
    console.log("Error fetching furniture type:", error);
    return res.status(500).json({ message: "Server error!" });
  }
};

// Update Furniture Type with Category Name
exports.UpdateFurnitype = async (req, res) => {
  try {
    const { furnitypeId } = req.params;
    const { name, ECT, categoryId } = req.body;

    // Find the furniture type by ID
    const existingFurnitype = await FurnitureType.findById(furnitypeId);
    if (!existingFurnitype) {
      return res.status(404).json({ message: "Furniture type not found!" });
    }

    // Check if the category exists by ID
    if (categoryId) {
      const existingCategory = await Category.findById(categoryId);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found!" });
      }
      // Only update categoryId if the category exists
      existingFurnitype.categoryId = existingCategory._id;
    }

    // Update only the provided fields
    if (name !== undefined) {
      existingFurnitype.name = name;
    }
    
    if (ECT !== undefined) {
      existingFurnitype.ECT = ECT;
    }

    // Save the updated furniture type
    const updatedFurnitype = await existingFurnitype.save();

    // Return the updated furniture type
    res.status(200).json({ message: "Furniture type updated successfully!", updatedFurnitype });
  } catch (error) {
    console.error("Error in updating furniture type: ", error);
    res.status(500).json({ message: "Server error!" });
  }
};