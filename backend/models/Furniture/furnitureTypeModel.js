const mongoose = require('mongoose');

const furnitureTypeSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true
  },
  ECT:{
    type:Number,
    required:true,
    default:1
  },
  categoryId:{
    type:mongoose.Schema.ObjectId,
    ref:'Category',
    required:true
  },
  materials:[
    {
      type:mongoose.Schema.ObjectId,
      ref:"Materials"
    }
  ],
  sizes:[
    {
      type:mongoose.Schema.ObjectId,
      ref:"Size"
    }
  ],
  isArchived:{
    type:Boolean,
    default:false
  }
},{
  timestamps:true
})

const FurnitureType = mongoose.model("FurnitureType",furnitureTypeSchema);
module.exports = FurnitureType;