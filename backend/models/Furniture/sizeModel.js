const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  label: { 
    type: String, 
    required: true
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
  length: {
    type: Number,
  },
  depth: {
    type: Number,
  },
  furnitureTypeId: { 
    type: mongoose.Schema.ObjectId, 
    ref: "FurnitureType", 
    required: true
  },
  isArchived:{
    type:Boolean,
    default:false
  }
},{
  timestamps:true
});

const Size = mongoose.model("Size", sizeSchema);
module.exports = Size;
