const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true
  },
  stocks:{
    type:Number,
    required:true
  },
  isArchived:{
    type:Boolean,
    default:false
  }
},{
  timestamps:true
})

const Materials = mongoose.model("Materials",materialSchema);
module.exports = Materials;
