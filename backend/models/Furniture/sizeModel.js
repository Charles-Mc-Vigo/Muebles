const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  label: { 
    type: String, 
    required: true // e.g., "twinsize"
  },
  width: {
    type: Number,
    required: true // Width in cm, mm, or your preferred unit
  },
  height: {
    type: Number,
    required: true // Height in cm, mm, or your preferred unit
  },
  depth: {
    type: Number,
    required: true // Depth in cm, mm, or your preferred unit
  },
  furnitureType: { 
    type: mongoose.Schema.ObjectId, 
    ref: "FurnitureType", 
    required: true // Link the size to a category
  }
});

const Size = mongoose.model("Size", sizeSchema);
module.exports = Size;
