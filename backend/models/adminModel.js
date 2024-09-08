const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
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
    type:Boolean,
    required:true
  },
  role:{
    type: String,
    default:"Admin"
  }
},
{
  timestamp:true
})

const Admin = mongoose.model('Admin',adminSchema);
module.exports = Admin;