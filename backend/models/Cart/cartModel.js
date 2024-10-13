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
        default: 1 // Set a default quantity of 1 when adding a new item
      },
    },
  ],
  count: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0 // Initial total amount set to 0
  }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
