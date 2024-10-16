const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  image:{
    type:String,
    default:null
  },
  firstname:{
    type:String,
    required:true
  },
  lastname:{
    type:String,
    required:true
  },
  gender:{
    type:String,
    enum:["Male","Female"],
    required:true
  },
  phoneNumber:{
    type:String,
    required:true,
    unique:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type: String,
    default:"Guest"
  },
  adminApproval:{
    type:String,
    enum:["Pending","Accepted","Rejected"],
    default:"Pending"
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
  }
},
{
  timestamp:true
})

const Admin = mongoose.model('Admin',adminSchema);
module.exports = Admin;