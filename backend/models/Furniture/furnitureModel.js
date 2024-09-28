const mongoose = require("mongoose");

const furnitureSchema = new mongoose.Schema({
  images: [{ type: String }], // Array of image filenames or URLs
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  furnitureType: { type: mongoose.Schema.Types.ObjectId, ref: 'FurnitureType', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  materials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Materials' }],
  colors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Colors' }],
  sizes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Size' }], // Reference to Size model
  stocks: { type: Number, required: true },
  price: { type: Number, required: true },
});

const Furniture = mongoose.model("Furniture", furnitureSchema);
module.exports = Furniture;