const FurnitureType = require("../../models/Furniture/furnitureTypeModel");

exports.AddFurnitureType = async(req,res)=>{
  try {
    const {name, category} = req.body;

    if(!name || !category){
      return res.status(400).json({message:"All fields are required:  name, category!"})
    }
    const existingName = await FurnitureType.findOne({name, category})

    if(existingName){
      return res.status(400).json({message:"Furniture type is already existing!"})
    }
    const newFurnitureType = new FurnitureType({name, category});
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

//to be continue