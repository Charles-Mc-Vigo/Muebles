const mongoose = require("mongoose");

const furnitureSchema = new mongoose.Schema({
  image: {
    type: String,
    required:true
  },
  category: {
    type:mongoose.Schema.ObjectId,
    ref:"Category",
    require:true
  },
  furnitureType:{
    type:mongoose.Schema.ObjectId,
    ref:"FurnitureType",
    required:true
  },
  name:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  material:{
    type:mongoose.Schema.ObjectId,
    ref:"Materials",
    required:true
  },
  color:{
    type:mongoose.Schema.ObjectId,
    ref:"Colors",
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