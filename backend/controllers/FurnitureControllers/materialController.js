const Materials = require('../../models/Furniture/materialsModel')

exports.addMaterials = async (req,res) =>{
  try {
    const {name} = req.body;

    if(!name){
      res.status(401).json({message:"Material is required!"})
    }

    const newMaterial = new Materials({name});
    await newMaterial.save();
    res.status(201).json({message:`${newMaterial.name} added successfully!`})
  } catch (error) {
    console.log("Error adding color material: ",error);
    res.status(500).json({message:"Server error"});
  }
}

exports.getMaterials = async (req,res) =>{
  try {
    const materials = await Materials.find();
    if(materials.length === 0){
      res.status(404).json({message:"No materials found!"})
    }

    res.status(200).json(materials)
  } catch (error) {
    console.log("Error adding color material: ",error);
    res.status(500).json({message:"Server error"});
  }
}