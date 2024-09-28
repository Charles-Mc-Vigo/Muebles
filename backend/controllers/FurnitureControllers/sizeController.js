const Size = require("../../models/Furniture/sizeModel");

exports.addSize = async(req,res) =>{
  try {
    const size = req.body;

    if(!size) return res.status(400).json({message:"Size is required!"});
    
    const newSize = new Size(size);
    await newSize.save();
    res.status(201).json({message:"New size has been added successfully!"})
  } catch (error) {
    console.log("Error adding size",error);
    res.status(500).json({message:"Server error!"})
  }
}

exports.getSizes = async(req,res) => {
  try {
    const sizes = await Size.find();
    if(!sizes) return res.status(400).json({message:"No sizes found! please create one"})
    res.status(200).json(sizes)
  } catch (error) {
    console.log('Error fetching the sizes:',error);
    res.status(500).json({message:"Server error!"})
  }
}