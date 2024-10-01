const mongoose = require("mongoose");

const furnitureSchema = new mongoose.Schema({
  images: [{type:String, required:true}],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  furnitureType: { type: mongoose.Schema.Types.ObjectId, ref: 'FurnitureType', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  materials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Materials' }],
  colors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Colors' }],
  sizes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Size' }], // Reference to Size model
  stocks: {type:mongoose.Schema.ObjectId, ref:"Stocks"},
  price: { type: Number, required: true },

  isArchived:{
    type:Boolean,
    default:false
  }
},{
  timestamps:true
});

const Furniture = mongoose.model("Furniture", furnitureSchema);
module.exports = Furniture;
