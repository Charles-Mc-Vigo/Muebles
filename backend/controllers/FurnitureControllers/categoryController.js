const Category = require("../../models/Furniture/categoryModel");
const FurnitureType = require("../../models/Furniture/furnitureTypeModel");
const mongoose = require("mongoose");

exports.AddCategory = async (req, res) => {
	try {
		const { name } = req.body;

		const existingCategory = await Category.findOne({ name });
		if (existingCategory)
			return res.status(400).json({ message: `${name} is already existing!` });

		const newCategory = new Category({ name });
		await newCategory.save();
		res
			.status(200)
			.json({ message: "Category added successfully", category: newCategory });
	} catch (error) {
		console.error("Error adding new category: ", error);
		res.status(500).send("Server error!");
	}
};

exports.ArchiveCategory = async (req, res) => {
	try {
		const {categoryId} = req.params;
		const existingCategory = await Category.findById(categoryId);

		if(!existingCategory) return res.status(404).json({message:"Category not found!"});

		existingCategory.isArchived = true;
		await existingCategory.save();
		res.status(200).json({message:`${existingCategory.name} has been archived!`})
	} catch (error) {
		console.error("Error in archiving category: ", error);
		res.status(500).json({message:"Server error!"});
	}
};

exports.unArchiveCategory = async (req, res) => {
	try {
		const {categoryId} = req.params;
		const existingCategory = await Category.findById(categoryId);

		if(!existingCategory) return res.status(404).json({message:"Category not found!"});

		existingCategory.isArchived = false;
		await existingCategory.save();
		res.status(200).json({message:`${existingCategory.name} has been archived!`})
	} catch (error) {
		console.error("Error in archiving category: ", error);
		res.status(500).json({message:"Server error!"});
	}
};

exports.viewArchivedCategory = async (req,res) => {
	try {
		const archivedCategory = await Category.find({isArchived:true});

		if(archivedCategory === 0) return res.status(200).json({message:"No archived category!"});

		res.status(200).json(archivedCategory);
	} catch (error) {
		console.error("Error fethcing archived category: ",error);
		res.status(500).json({message:"Server error!"});
	}
}

exports.getCategory = async (req, res) => {
	try {
		const category = await Category.find({isArchived:false});

		if (category.length === 0) {
			return res.status(404).json({ message: "No category found!" });
		}
		res.status(200).json(category);
	} catch (error) {
		console.log("Error fetching the categories: ", error);
		res.status(500).json({ message: "Server error!" });
	}
};

exports.getCategoryById = async (req, res) => {
	try {
		const { id } = req.params;

		// Prepare the filters object with the ID and any additional query parameters
		const filters = { _id: id, ...req.query };

		const category = await Category.findOne(filters); // Use findOne instead of findById

		if (!category) {
			return res.status(404).json({ message: "Category not found!" });
		}
		res.status(200).json(category);
	} catch (error) {
		console.log("Error fetching the categories: ", error);
		res.status(500).json({ message: "Server error!" });
	}
};


exports.getAllTypesInCategory = async (req, res) => {
	try {
		const { categoryId } = req.params;
		const category = await Category.findById(categoryId);

		if (!category) {
			return res.status(404).json({ message: "Category not found!" });
		}

		const furnitureType = await FurnitureType.find({
			categoryId: category._id,
		});
		if (furnitureType.length === 0) {
			return res
				.status(404)
				.json({ message: `No furniture types found in ${category.name}` });
		}
		res.status(200).json(furnitureType);
	} catch (error) {
		console.log("Error fetching the categories: ", error);
		res.status(500).json({ message: "Server error!" });
	}
};

exports.EditCategoryById = async (req, res) => {
	try {
		const { categoryId } = req.params;

		// Validate ObjectId
		if (!mongoose.Types.ObjectId.isValid(categoryId)) {
			return res.status(400).json({ message: "Invalid category ID!" });
		}

		const category = await Category.findById(categoryId);

		if (!category) {
			return res.status(404).json({ message: "Category not found!" });
		}

		const { name } = req.body;

		if (!name) {
			return res.status(400).json({ message: "Category name is required!" });
		}

		category.name = name;
		await category.save();
		res.status(200).json({ message: "Category is successfully modified!" });
	} catch (error) {
		console.log("Error editing furniture: ", error);
		res.status(500).json({ message: "Server error!" });
	}
};
