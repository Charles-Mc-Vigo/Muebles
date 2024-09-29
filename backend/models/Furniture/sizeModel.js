const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  label: { 
    type: String, 
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true 
  },
  depth: {
    type: Number,
    required: true
  },
  furnitureType: { 
    type: mongoose.Schema.ObjectId, 
    ref: "FurnitureType", 
    required: true
  }
});

const Size = mongoose.model("Size", sizeSchema);
module.exports = Size;
