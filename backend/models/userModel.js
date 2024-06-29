const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
  phoneNumber: { 
    type: String, 
    unique: true, 
    required: true
  },
  streetAddress: { type: String, required: true },
	municipality: { 
    type: String, 
    enum:["Boac","Gasan","Torrijos","Buenavista", "Mogpog","Santa Cruz"],
    required: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true
  },
    password: { 
    type: String, 
    required: true
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
