const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      furnitureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Furniture',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      },
      material: { type: String },
      color: { type: String },
      size: { type: String },
      ECT:{type:Number}
    },
  ],
  count: {
    type: Number,
    default: 0
  },
  expectedDelivery:{type:String},
  totalAmount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
