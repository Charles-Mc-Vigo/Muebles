const mongoose = require("mongoose");
const Size = require("../../models/Furniture/sizeModel");
const FurnitureType = require("../../models/Furniture/furnitureTypeModel");

// Add a new size
exports.addSize = async (req, res) => {
	try {
		const { label, width, height, depth,length, furnitureTypeId } = req.body;

		if (!label || !width || !height || !length || !depth || !furnitureTypeId) {
			return res
				.status(400)
				.json({
					message:
						"All fields are required: label, width, height, depth, and furnitureTypeId.",
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

		const newSize = new Size({ label, width, height, length, depth, furnitureTypeId });
		await newSize.save();
		res
			.status(201)
			.json({ message: `New size has been added ${furnitureType.name}!` });
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
      return res.status(404).json({message:`No sizes available for ${furnitureType.name}`})
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
    const allSizes = await Size.find();
    if(allSizes.length === 0){
      return res.status(404).json({message:"No sizes found! Please create one"})
    }
    res.status(200).json(allSizes)
  } catch (error) {
    console.log("Error fetching all sizes: ", error);
    res.status(500).json("Server error!")
  }
}
