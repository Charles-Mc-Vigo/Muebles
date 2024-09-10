const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required: true
  },
  items:[
    {
      furnitureId:{
        type:mongoose.Schema.ObjectId,
        ref:"Furniture",
        required:true
      },
      quantity:{
        type:Number,
        required:true,
        default:1
      }
    }
  ]
},{
  timestamps:true
})

const Cart = mongoose.model('Cart',cartSchema);
module.exports = Cart;