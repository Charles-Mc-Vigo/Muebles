const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true
  },
  items: [{
    furniture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Furniture',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  shippingAddress: {
    streetAddress: String,
    municipality: String,
    barangay: String,
    zipCode: Number
  },
  phoneNumber: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'GCash', 'Maya'],
    required: true
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending'
  },
  isAccepted:{
    type:Boolean,
    required:true,
    default:false
  },
  subtotal: Number,
  shippingFee: Number,
  totalAmount: Number
}, {
  timestamps: true
});

// Generate simple order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `ORD-${date.getFullYear()}${randomNum}`;
  }
  next();
});

// Static method to create order from cart
orderSchema.statics.createFromCart = async function(cartId, paymentMethod) {
  const cart = await mongoose.model('Cart').findById(cartId)
    .populate('userId')
    .populate('items.furnitureId');
  
  if (!cart) throw new Error('Cart not found');

  const orderData = {
    user: cart.userId._id,
    items: cart.items.map(item => ({
      furniture: item.furnitureId._id,
      quantity: item.quantity,
      price: item.furnitureId.price
    })),
    shippingAddress: {
      streetAddress: cart.userId.streetAddress,
      municipality: cart.userId.municipality,
      barangay: cart.userId.barangay,
      zipCode: cart.userId.zipCode
    },
    phoneNumber: cart.userId.phoneNumber,
    paymentMethod: paymentMethod,
    subtotal: cart.totalAmount,
    shippingFee: 100, // Fixed shipping fee for simplicity
    totalAmount: cart.totalAmount + 100
  };

  return this.create(orderData);
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 