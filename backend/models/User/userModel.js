const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  image:{
    type:String,
    default:null
  },
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
    enum:["Boac","Gasan","Torrijos","Buenavista", "Mogpog","Santa_Cruz"],
    required: true
  },
  barangay:{
    type:String,
    required:true
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
  role:{
    type:String
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
  agreeToTerms:{
    type:Boolean,
    default:false,
    required:true
  },
  orders:[{
    type:mongoose.Schema.ObjectId,
    ref:"Order"
  }],
  cart:[{
    type:mongoose.Schema.ObjectId,
    ref:"Cart",
    default:null
  }]
},{
  timestamps:true
});

const User = mongoose.model("User", userSchema);
module.exports = User;
