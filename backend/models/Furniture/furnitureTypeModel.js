const mongoose = require('mongoose');

const furnitureTypeSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true
  },
  categoryId:{
    type:mongoose.Schema.ObjectId,
    ref:'Category',
    required:true
  }
})

const FurnitureType = mongoose.model("FurnitureType",furnitureTypeSchema);
module.exports = FurnitureType;