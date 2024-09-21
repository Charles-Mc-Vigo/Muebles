const mongoose = require("mongoose");

const furnitureSchema = new mongoose.Schema({
  image: {
    type: String,
    required:true
  },
  category: {
    type:String,
    require:true
  },
  furnitureType:{
    type:String,
    required:true
  },
  // furnitureName:{
  //   type:String,
  //   required:true
  // },
  description:{
    type:String,
    required:true
  },
  material:{
    type:String,
    required:true
  },
  // color:{
  //   type:String,
  //   required:true
  // },
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