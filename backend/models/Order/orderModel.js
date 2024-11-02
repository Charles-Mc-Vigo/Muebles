const mongoose = require('mongoose');

// Shipping fee mapping
const SHIPPING_FEES = {
  'Mogpog': 700,
  'Boac': 500,
  'Gasan': 500,
  'Buenavista': 800,
  'Santa_Cruz': 3000,
  'Torrijos': 3000
};

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
    },
    material: { type: String },
    color: { type: String },
    size: { type: String }
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
  proofOfPayment:{
    type: String,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending'
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

// Helper function to calculate shipping fee
const calculateShippingFee = (municipality) => {
  const fee = SHIPPING_FEES[municipality];
  if (!fee) {
    throw new Error(`Invalid municipality: ${municipality}`);
  }
  return fee;
};

// Static method to create order from cart
orderSchema.statics.createFromCart = async function(cartId, paymentMethod, proofOfPayment) {
  const cart = await mongoose.model('Cart').findById(cartId)
    .populate('userId')
    .populate('items.furnitureId');
  
  if (!cart) throw new Error('Cart not found');
  
  // Find the user's default or primary address
  const user = await mongoose.model('User').findById(cart.userId._id);
  if (!user || !user.addresses || user.addresses.length === 0) {
    throw new Error('User address not found');
  }
  
  // Get the primary or first address
  const primaryAddress = user.addresses.find(addr => addr.addressStatus === 'primary') || user.addresses[0];
  
  // Calculate shipping fee based on municipality
  const shippingFee = calculateShippingFee(primaryAddress.municipality);
  
  const orderData = {
    user: cart.userId._id,
    items: cart.items.map(item => ({
      furniture: item.furnitureId._id,
      quantity: item.quantity,
      price: item.furnitureId.price,
      material: item.material,
      color: item.color,
      size: item.size,
    })),
    shippingAddress: {
      streetAddress: primaryAddress.streetAddress,
      municipality: primaryAddress.municipality,
      barangay: primaryAddress.barangay,
      zipCode: primaryAddress.zipCode
    },
    phoneNumber: user.phoneNumber,
    paymentMethod: paymentMethod,
    subtotal: cart.totalAmount,
    shippingFee: shippingFee,
    totalAmount: cart.totalAmount + shippingFee,
    proofOfPayment: proofOfPayment
  };

  return this.create(orderData);
};

// Static method to create direct order
orderSchema.statics.createDirectOrder = async function(orderData) {
  // Validate required fields
  if (!orderData.userId || !orderData.items || !orderData.paymentMethod) {
    throw new Error('Missing required fields');
  }

  // Fetch user details
  const user = await mongoose.model('User').findById(orderData.userId);
  if (!user) throw new Error('User not found');

  // Fetch furniture details and validate stock
  const furniturePromises = orderData.items.map(async (item) => {
    const furniture = await mongoose.model('Furniture').findById(item.furnitureId);
    if (!furniture) throw new Error(`Furniture with ID ${item.furnitureId} not found`);
    if (furniture.stockQuantity < item.quantity) {
      throw new Error(`Insufficient stock for furniture: ${furniture.name}`);
    }
    return {
      furniture: furniture._id,
      quantity: item.quantity,
      material: item.material,
      color: item.color,
      size: item.size,
      price: furniture.price
    };
  });

  const processedItems = await Promise.all(furniturePromises);

  // Calculate totals
  const subtotal = processedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Get shipping address (either from order data or user's default address)
  const shippingAddress = orderData.shippingAddress || 
    (user.addresses.find(addr => addr.addressStatus === 'primary') || user.addresses[0]);
  
  if (!shippingAddress || !shippingAddress.municipality) {
    throw new Error('Valid shipping address with municipality is required');
  }

  // Calculate shipping fee based on municipality
  const shippingFee = calculateShippingFee(shippingAddress.municipality);
  const totalAmount = subtotal + shippingFee;

  // Prepare order document
  const order = {
    user: user._id,
    items: processedItems,
    shippingAddress: {
      streetAddress: shippingAddress.streetAddress,
      municipality: shippingAddress.municipality,
      barangay: shippingAddress.barangay,
      zipCode: shippingAddress.zipCode
    },
    phoneNumber: orderData.phoneNumber || user.phoneNumber,
    paymentMethod: orderData.paymentMethod,
    proofOfPayment: orderData.proofOfPayment,
    subtotal,
    shippingFee,
    totalAmount
  };

  // Create and return the order
  return this.create(order);
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;