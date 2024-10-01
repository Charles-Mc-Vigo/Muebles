const Colors = require("../../models/Furniture/colorModel");

exports.addColor = async (req,res) => {
  try {
    const {name, rgb, hex} = req.body;

    if(!name ||!rgb || !hex){
      return res.status(401).json({message:"All inputs are required! name, rgb, hex"})
    }

    const newColor = new Colors({name, rgb, hex});
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

exports.editColor = async (req,res) => {
  try {
    co
  } catch (error) {
    console.log("Error editing color: ",error);
    res.status(500).json({message:"Server error!"})
  }
}