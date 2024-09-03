const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
  gender:{
    type:String,
    enum:["Male","Female"],
    required:true
  },
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
    type: Number
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
  isAdmin:{
    type:Boolean,
    default: false
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  verificationCode: {
    type: String
  },
  verificationCodeExpires: {
    type: Date
  },
  orders:[{
    type:mongoose.Schema.ObjectId,
    ref:"Order"
  }]
},{
  timestamps:true
});

const User = mongoose.model("User", userSchema);
module.exports = User;
