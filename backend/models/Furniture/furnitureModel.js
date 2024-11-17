const mongoose = require("mongoose");

const furnitureSchema = new mongoose.Schema({
  images: { type: [String], required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  furnitureType: { type: mongoose.Schema.Types.ObjectId, ref: 'FurnitureType', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  materials: [{type:Object}],
  colors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Colors' }],
  sizes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Size' }],
  price: { type: Number },

  isArchived:{
    type:Boolean,
    default:false
  }
},{
  timestamps:true
});

const Furniture = mongoose.model("Furniture", furnitureSchema);
module.exports = Furniture;
