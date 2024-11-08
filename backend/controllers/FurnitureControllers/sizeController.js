const mongoose = require("mongoose");
const Size = require("../../models/Furniture/sizeModel");
const FurnitureType = require("../../models/Furniture/furnitureTypeModel");

// Add a new size
exports.addSize = async (req, res) => {
	try {
		const { label, height, length, width, depth, furnitureTypeId } = req.body;

		if (!label || !furnitureTypeId) {
			return res
				.status(400)
				.json({
					message:
						"Size label and furnitureTypeId is required",
				});
		}

		// Validate furniture id
		if (!mongoose.Types.ObjectId.isValid(furnitureTypeId)) {
			return res
				.status(400)
				.json({
					message: "Invalid category ID. Must be a 24-character hex string.",
				});
		}

		const furnitureType = await FurnitureType.findById(furnitureTypeId);
		if (!furnitureType) {
			return res.status(404).json({ message: "Furniture type not found!" });
		}

		// Check if the size already exists for the category
		const existingSize = await Size.findOne({ label, furnitureTypeId });
		if (existingSize) {
			return res
				.status(400)
				.json({
					message: "This size already exists for the selected category.",
				});
		}

		const newSize = new Size({ label, width, length, height, depth, furnitureTypeId });
		await newSize.save();
		res
			.status(201)
			.json({ message: `New size has been added ${furnitureType.name}!`,newSize });
	} catch (error) {
		console.error("Error adding size:", error);
		res.status(500).json({ message: "Server error!" });
	}
};

// Get all sizes (or by category if categoryId is provided)
exports.getSizes = async (req, res) => {
	try {
		const { furnitureTypeId } = req.params;

    		// Validate furniture type id
		if (!mongoose.Types.ObjectId.isValid(furnitureTypeId)) {
			return res
				.status(400)
				.json({
					message: "Invalid category ID. Must be a 24-character hex string.",
				});
		}

    const furnitureType = await FurnitureType.findById(furnitureTypeId);

    if(!furnitureType){
      return res.status(404).json({message:"Furniture type not found!"});
    }

    const avalableSizes = await Size.find({furnitureTypeId:furnitureType});
    if(avalableSizes.length===0){
      return res.status(200).json({message:`No sizes available for ${furnitureType.name}`})
    }

		res.status(200).json(avalableSizes);
	} catch (error) {
		console.error("Error fetching the sizes:", error);
		res.status(500).json({ message: "Server error!" });
	}
};

// Get size by ID
exports.getSizeById = async (req, res) => {
	try {
		const { sizeId } = req.params;

		const size = await Size.findById(sizeId).populate("furnitureTypeId");
		if (!size) {
			return res.status(404).json({ message: "Size not found!" });
		}

		res.status(200).json(size);
	} catch (error) {
		console.error("Error fetching the size:", error);
		res.status(500).json({ message: "Server error!" });
	}
};

exports.GetAllSizes = async (req,res) =>{
  try {
    const allSizes = await Size.find({isArchived:false});
    if(allSizes.length === 0){
      return res.status(200).json({message:"No sizes found! Please create one"})
    }
    res.status(200).json(allSizes)
  } catch (error) {
    console.log("Error fetching all sizes: ", error);
    res.status(500).json("Server error!")
  }
}

exports.UpdateSize = async (req, res) => {
	try {
		const { sizeId } = req.params;
		const existingSize = await Size.findById(sizeId);

		if (!existingSize) return res.status(404).json({ message: "Size not found!" });

		const { label, height, length, width, depth } = req.body;

		// // Check if no fields were provided in the request body
		// if (label === undefined && length === undefined && height === undefined && width === undefined && depth === undefined) {
		// 	return res.status(400).json({ message: "At least one field is required to update: label, height, width, or depth" });
		// }

		// Only update fields that are provided in the request body
		if (label !== undefined && existingSize.label !== label) existingSize.label = label;
		if (height !== undefined && existingSize.height !== height) existingSize.height = height;
		if (length !== undefined && existingSize.length !== length) existingSize.length = length;
		if (width !== undefined && existingSize.width !== width) existingSize.width = width;
		if (depth !== undefined && existingSize.depth !== depth) existingSize.depth = depth;

		// Check if any changes were made
		if (
			existingSize.label === label &&
			existingSize.height === height &&
			existingSize.length === length &&
			existingSize.width === width &&
			existingSize.depth === depth
		) {
			return res.status(400).json({ message: "No changes made!" });
		}

		await existingSize.save();
		res.status(200).json({ message: `${existingSize.label} has been modified` });
	} catch (error) {
		console.error("Error in updating the size: ", error);
		res.status(500).json({ message: "Server error!" });
	}
};


exports.ArchiveSize = async (req,res) => {
	try {
		const {sizeId} = req.params;
		const existingSize = await Size.findById(sizeId);
		if(!existingSize) return res.status(404).json({message:"Size not found!"});
		existingSize.isArchived=true
		await existingSize.save();
		res.status(200).json({message:`${existingSize.label} has been archived`})
	} catch (error) {
		console.error("Error in archiving size: ",error);
		res.status(500).json({message:"Server error!"})
	}
}