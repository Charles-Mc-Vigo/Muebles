const Admin = require('../models/adminModel');
exports.AllAdmin = async (req,res)=>{
  try {
    
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Server error!"})
  }
}