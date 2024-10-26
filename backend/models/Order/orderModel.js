const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId : {
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:true,
  },
})