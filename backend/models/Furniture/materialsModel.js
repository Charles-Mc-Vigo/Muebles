const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  furnitureTypeId: {
    type: mongoose.Schema.ObjectId,
    ref: "FurnitureType",
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  stock: {
    type: Number,
    required: true,
    default: 1,
  },
  isArchived: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

// Compound index to allow same name for different furnitureTypeId
materialSchema.index({ name: 1, furnitureTypeId: 1 }, { unique: true });

const Materials = mongoose.model("Materials", materialSchema);

module.exports = Materials;
