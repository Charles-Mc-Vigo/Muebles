const mongoose = require("mongoose");

const furnitureSchema = new mongoose.Schema({
  image: {
    type: String,
    required:true
  },
  category: {
    type:String,
    require:true
  }, // Change this to String
  furnitureType:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true,
    default:0
  }
},{
  timestamps:true
})

const Furniture = mongoose.model("Furniture",furnitureSchema);
module.exports = Furniture;