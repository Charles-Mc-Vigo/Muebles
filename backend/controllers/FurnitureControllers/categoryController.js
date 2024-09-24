const Category = require("../../models/Furniture/categoryModel");

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