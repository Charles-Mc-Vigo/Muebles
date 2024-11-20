const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  label: { 
    type: String, 
    required: true
  },
  price:{
    type:Number,
    require:true,
    default:0
  },
  width: {
    type: Number,
    default:"N/A"
  },
  height: {
    type: Number,
    default:0
  },
  length: {
    type: Number,
    default:0
  },
  depth: {
    type: Number,
    default:0
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
