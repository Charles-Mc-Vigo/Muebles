const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  rgb: {
    type: String,
    required: true
  },
  hex: {
    type: String,
    required: true
  },
  isArchived:{
    type:Boolean,
    default:false
  }
}, {
  timestamps: true
});

const Colors = mongoose.model('Colors', colorSchema);
module.exports = Colors;