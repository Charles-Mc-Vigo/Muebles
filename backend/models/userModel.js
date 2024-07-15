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
  zipCode: {
    type: Number,
    default: function() {
      const zipCodes = {
        "Boac": 4900,
        "Gasan": 4903,
        "Torrijos": 4904,
        "Buenavista": 4901,
        "Mogpog": 4902,
        "Santa Cruz": 4905
      };
      return zipCodes[this.municipality] || 0;
    }
  },
  email: { 
    type: String, 
    required: true, 
    unique: true
  },
    password: { 
    type: String, 
    required: true
  },
  orders:[{
    type:mongoose.Schema.ObjectId,
    ref:"Order"
  }],
  createdAt:{
    type:Date,
    default: Date.now
  }
},{
  timestamps:true
});

const User = mongoose.model("User", userSchema);
module.exports = User;
