const mongoose = require("mongoose");

const furnitureSchema = new mongoose.Schema({
  images: { type: [String], required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  furnitureType: { type: mongoose.Schema.Types.ObjectId, ref: 'FurnitureType', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  colors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Colors' }],
  materials:[
    {
      type:Object,
      required:true
    }
  ],
  sizes:[
    {
      type:Object,
      required:true
    }
  ],
  
  // price: { 
  //   type: Number,
  //   required: true
  // },

  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create model for Furniture
const Furniture = mongoose.model("Furniture", furnitureSchema);
module.exports = Furniture;
