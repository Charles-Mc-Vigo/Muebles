const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true
  },
  price:{
    type:Number,
    required:true,
    default:0
  },
  stock:{
    type:Number,
    required:true,
    default:1
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
