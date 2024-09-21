const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true
  }
})

const Materials = mongoose.model("Materials",materialSchema);
module.exports = Materials;
