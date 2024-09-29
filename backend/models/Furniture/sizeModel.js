const { required } = require("joi");
const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  size:{
    type:String,
    required:true,
    default:null
  }
});

const Size = mongoose.model("Size", sizeSchema);
module.exports = Size;