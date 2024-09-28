const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  type: String
});

const Images = mongoose.model("Images", ImageSchema);
module.exports = Images;