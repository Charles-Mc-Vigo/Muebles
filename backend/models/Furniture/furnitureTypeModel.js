const mongoose = require('mongoose');

const furnitureTypeSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true
  },
  estimatedProductionDays:{
    type:Number
  },
  categoryId:{
    type:mongoose.Schema.ObjectId,
    ref:'Category',
    required:true
  },
  isArchived:{
    type:Boolean,
    default:false
  }
},{
  timestamps:true
})

const FurnitureType = mongoose.model("FurnitureType",furnitureTypeSchema);
module.exports = FurnitureType;