const Materials = require('../../models/Furniture/materialsModel');
const FurnitureType = require('../../models/Furniture/furnitureTypeModel');

exports.addMaterials = async (req, res) => {
  try {
    const { name, price, stocks, furnitureTypeId } = req.body;

    // // Validate required fields
    // if (!name || !price || !stocks || !furnitureTypeId) {
    //   return res.status(401).json({ message: "Material's name, price, stocks, and furnitureTypeId are required!" });
    // }

    // Check if material with the same name already exists for the same furnitureTypeId
    const existingMaterial = await Materials.findOne({ name, furnitureTypeId });
    if (existingMaterial) {
      return res.status(400).json({ message: `Material with name '${name}' already exists under this FurnitureType!` });
    }

    // Create new material
    const newMaterial = new Materials({ name, price, stocks, furnitureTypeId });
    await newMaterial.save();

    // Find the corresponding FurnitureType and add materialId to its materials array
    const furnitureType = await FurnitureType.findById(furnitureTypeId);
    if (!furnitureType) {
      return res.status(404).json({ message: "FurnitureType not found!" });
    }

    // Add the new material to the materials array of the FurnitureType (using addToSet to avoid duplicates)
    furnitureType.materials.addToSet(newMaterial._id);  // addToSet avoids duplicates
    await furnitureType.save();  // Save the updated FurnitureType

    // Return the response with the newly added material and updated FurnitureType
    return res.status(201).json({
      message: `${newMaterial.name} added successfully!`,
      newMaterial,
      updatedFurnitureType: furnitureType,
    });
  } catch (error) {
    console.log("Error adding material: ", error);
    return res.status(500).json({ message: "Server error" });
  }
};



// Get specific material by ID
exports.getSpecificMaterial = async (req, res) => {
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

// Get all materials that are not archived
exports.getMaterials = async (req, res) => {
  try {
    const materials = await Materials.find({ isArchived: false });

    if (materials.length === 0) {
      return res.status(200).json({ message: "No materials found!" });
    }

    return res.status(200).json(materials);
  } catch (error) {
    console.log("Error fetching materials: ", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// Get all archived materials
exports.ArchivedMaterials = async (req, res) => {
  try {
    const archivedMaterials = await Materials.find({ isArchived: true });
    if (archivedMaterials.length === 0) {
      return res.status(200).json({ message: "No archived materials found!" });
    }

    return res.status(200).json(archivedMaterials);
  } catch (error) {
    console.log("Error fetching archived materials: ", error);
    return res.status(500).json({ message: "Server error!" });
  }
};

// Archive a material by ID
exports.ArchivingMaterials = async (req, res) => {
  try {
    const { materialId } = req.params;

    const material = await Materials.findById(materialId);
    if (!material) return res.status(404).json({ message: "Material not found!" });

    material.isArchived = true;
    await material.save();
    return res.status(200).json({ message: `${material.name} has been archived successfully!` });
  } catch (error) {
    console.log("Error archiving material: ", error);
    return res.status(500).json({ message: "Server error!" });
  }
};

// Unarchive a material by ID
exports.UnArchivingMaterials = async (req, res) => {
  try {
    const { materialId } = req.params;

    const material = await Materials.findById(materialId);
    if (!material) return res.status(404).json({ message: "Material not found!" });

    material.isArchived = false;
    await material.save();
    return res.status(200).json({ message: `${material.name} has been unarchived successfully!` });
  } catch (error) {
    console.log("Error unarchiving material: ", error);
    return res.status(500).json({ message: "Server error!" });
  }
};

// Edit material by ID
exports.editMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const material = await Materials.findById(materialId);
    if (!material) return res.status(404).json({ message: "Material not found!" });

    if(material.stocks == null){
      material.stocks = 1;
    }
    if(material.price == null){
      material.price = 0;
    }

    const { name, price, stocks, furnitureTypeId} = req.body;

    // Check if any changes were made
    if (name === undefined && price === undefined && stocks === undefined) {
      return res.status(400).json({ message: "No changes made!" });
    }

    material.name = name;
    material.price = price;
    material.stocks = stocks;
    material.furnitureTypeId = furnitureTypeId;

    if (name !== undefined && material.name !== name) material.name = name;
    if (price !== undefined && material.price !== price) material.price = price;
    if (stocks !== undefined && material.stocks !== stocks) material.stocks = stocks;
    if (furnitureTypeId !== undefined && material.stocks !== furnitureTypeId) material.furnitureTypeId = furnitureTypeId;

    await material.save();
    return res.status(200).json({ message: `${material.name} has been edited successfully!` });
  } catch (error) {
    console.log("Error editing the materials: ", error);
    return res.status(500).json({ message: "Server error!" });
  }
};
