const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  size:{
    type:String,
    default:null
  }
});

const Size = mongoose.model("Size", sizeSchema);
module.exports = Size;