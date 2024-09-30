const Category = require("../../models/Furniture/categoryModel");
const FurnitureType = require("../../models/Furniture/furnitureTypeModel");

exports.AddCategory = async(req,res)=>{
  try {
    const {name} = req.body;

    const newCategory = new Category({name});
    await newCategory.save();
    res.json({ message: 'Category added successfully', category: newCategory });
  } catch (error) {
    console.log("Error adding new category: ",error)
    res.status(500).send('Server error!');
  }
}

exports.getCategory = async(req,res)=>{
  try {
    const category = await Category.find();

    if(category.length === 0){
      return res.status(404).json({message:"No category found!"})
    }
    res.status(200).json(category)

  } catch (error) {
    console.log("Error fetching the categories: ",error);
    res.status(500).json({message:"Server error!"})
  }
}

exports.getCategoryById = async(req,res)=>{
  try {
    const {id} = req.params;
    const category = await Category.findById(id);

    if(!category){
      return res.status(404).json({message:"Category not found!"})
    }
    res.status(200).json(category)

  } catch (error) {
    console.log("Error fetching the categories: ",error);
    res.status(500).json({message:"Server error!"})
  }
}



exports.getAllTypesInCategory = async(req,res)=>{
  try {
    const {categoryId} = req.params;
    const category = await Category.findById(categoryId);

    if(!category){
      return res.status(404).json({message:"Category not found!"})
    }

    const furnitureType = await FurnitureType.find({categoryId:category._id});
    if(furnitureType.length===0){
      return res.status(404).json({message:`No furniture types found in ${category.name}`})
    }
    res.status(200).json(furnitureType)

  } catch (error) {
    console.log("Error fetching the categories: ",error);
    res.status(500).json({message:"Server error!"})
  }
}

