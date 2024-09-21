const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    unique:true
  }
})

const Material = mongoose.model("Materials",materialSchema);
module.exports = Material;
