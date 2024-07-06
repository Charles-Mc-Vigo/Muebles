const mongoose = require("mongoose");
const Furniture = require("../models/furnitureModel");

//get all furnitures
exports.getAllFurnitures = async (req,res) => {
  try {
    const furnitures = await Furniture.find();
    res.status(200).json(furnitures);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

//create new furniture
exports.createFurniture = async (req,res) => {
  try {
    const {category,furnitureType, description, price} = req.body;

    if(!category || !furnitureType || !description || !price){
      return res.status(400).json({message:"All fields are required!"})
    }

    //check if furniture is existing in the database
    //ayaw ko na putanginaaaaaaa
    const existingFurniture = await Furniture.findOne({furnitureType})

    if(existingFurniture){
      return res.status(400).json({message: `${existingFurniture.furnitureType} is already existing`})
    }

    //save new furniture
    const newFurniture = new Furniture({
      category,
      furnitureType,
      description,
      price
    })

    await newFurniture.save()
    res.status(200).json({message:"New furniture is added successfully"})
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" });  }
}

//get furniture by id
//edit furniture by id
//delete furniture by id