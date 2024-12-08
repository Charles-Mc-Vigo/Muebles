const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  hex: {
    type: String,
    required: true,
    match: /^#([0-9A-F]{3}){1,2}$/i,
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