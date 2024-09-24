const Colors = require("../../models/Furniture/colorModel");

exports.addColor = async (req,res) => {
  try {
    const {name} = req.body;

    if(!name){
      return res.status(401).json({message:"Name of the color is required!"})
    }

    const newColor = new Colors({name});
    await newColor.save();
    res.status(201).json({message:`${newColor.name} is added successfully!`})
  } catch (error) {
    console.log('Error adding color: ', error);
    res.status(500).json({message:"Server error!"});
  }
}

exports.getColors = async (req,res) => {
  try {
    const colors = await Colors.find();
    if(colors.length === 0){
      return res.status(404).json({message:"No colors found!"})
    }
    res.status(200).json(colors);
  } catch (error) {
    console.log('Error fetching the colors: ', error);
    res.status(500).json({message:"Server error!"});
  }
}