const FurnitureType = require("../../models/Furniture/furnitureTypeModel");

exports.AddFurnitureType = async(req,res)=>{
  try {
    const {name} = req.body;

    const newFurnitureType = new FurnitureType({name});
    await newFurnitureType.save();

    res.status(201).json({message:`${newFurnitureType.name} is added successfully!`})
  } catch (error) {
    console.log('Error adding furniture type:',error);
    res.status(500).json({message:"Server error!"})
  }
}

exports.GetFurnitureType = async(req,res)=>{
  try {
    const furnitureType = await FurnitureType.find();
    if(furnitureType.length===0){
      res.status(404).json({message:"No furniture type found!"})
    }

    res.status(200).json(furnitureType)
  } catch (error) {
    console.log('Error fetching furniture type:',error);
    res.status(500).json({message:"Server error!"})
  }
}