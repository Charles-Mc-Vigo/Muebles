const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true
  }
})

const Colors = mongoose.model('Colors',colorSchema);
module.exports = Colors;