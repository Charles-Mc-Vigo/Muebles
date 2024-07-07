const mongoose = require("mongoose");
const Furniture = require("../models/furnitureModel");
const {
	FurnitureSchemaValidator,
} = require("../middlewares/FurnitureSchemaValidator");

//get all furnitures
exports.getAllFurnitures = async (req, res) => {
	try {
		const furnitures = await Furniture.find();
		res.status(200).json(furnitures);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server error!" });
	}
};

//create new furniture
exports.createFurniture = async (req, res) => {
	try {
		const { category, furnitureType, description, price } = req.body;

		if (!category || !furnitureType || !description || !price) {
			return res.status(400).json({ message: "All fields are required!" });
		}

		//check if furniture is existing in the database
		//ayaw ko na putanginaaaaaaa
		const existingFurniture = await Furniture.findOne({ furnitureType });

		if (existingFurniture) {
			return res.status(400).json({
				message: "Furniture is already existing!"
			});
		}

		const { error } = FurnitureSchemaValidator.validate({
			//save new furniture
			category,
			furnitureType,
			description,
			price,
		});

		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}
		const newFurniture = new Furniture({
			category,
			furnitureType,
			description,
			price,
		});

		await newFurniture.save();

		res.status(200).json({ message: "New furniture is added successfully!"});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server error!" });
	}
};

//get furniture by id
exports.getFurnitureById = async (req, res) => {
	try {
		const { id } = req.params;
		//check if specific furniture is existing
		const existingFurniture = await Furniture.findById(id);

		if (!existingFurniture) {
			return res.status(404).json({ message: "Furniture not found!" });
		}

		res.status(200).json(existingFurniture);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server error!" });
	}
};

//get furniture by category
exports.getFurnitureByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!["Door", "Bed frame", "Cabinet", "Chair", "Table", "Sala set"].includes(category)) {
      return res.status(400).json({ message: "Invalid category!" });
    }
    
    const furniture = await Furniture.find({ category });
    
    if (!furniture.length) {
      return res.status(404).json({ message: "No furniture found for this category!" });
    }
    
    res.status(200).json(furniture);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
};

//edit furniture by id
exports.editFurnitureById = async (req, res) => {
	try {
		const { id } = req.params;
		const { category, furnitureType, description, price } = req.body;

		//check if specific furniture is existing
		const existingFurniture = await Furniture.findById(id);

		if (!existingFurniture) {
			return res.status(404).json({ message: "Furniture not found!" });
		}


		if (category) existingFurniture.category = category;
		if (furnitureType) existingFurniture.furnitureType = furnitureType;
		if (description) existingFurniture.description = description;
		if (price) existingFurniture.price = price;

		existingFurniture.updatedAt = new Date();

		const { error } = FurnitureSchemaValidator.validate({
			category,
			furnitureType,
			description,
			price,
		});

		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}

		const modifiedFurniture = await existingFurniture.save();

		res
			.status(200)
			.json({
				message: `Changes has been saved!`,
			});

		res.status(200).json(existingFurniture);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server error!" });
	}
};

//delete furniture by id
exports.deleteFurnitureById = async (req,res) => {
  try {
    const {id} = req.params;

    //check existance
    const existingFurniture = await Furniture.findById(id);

    if(!existingFurniture){
      return res.status(404).json({message:"Furniture not found!"})
    }

    await existingFurniture.deleteOne();
    res.status(200).json({message:"Furniture deleted successfully!"})
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"Server error!"})
  }
}
