const Cart = require('../../models/Cart/cartModel')
const User = require('../../models/User/userModel');
const Furniture = require('../../models/Furniture/furnitureModel');

async function calculateTotalAmount(cart) {
  let total = 0;

  for (const item of cart.items) {
    const furniture = await Furniture.findById(item.furnitureId);
    if (furniture) {
      total += furniture.price * item.quantity; // Assuming furniture has a price field
    }
  }

  return total;
}


// Add one or more furniture items to the cart
exports.addItemsToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const furnitureIds = req.body.furnitureIds; // Get the array of furnitureIds

    if (!Array.isArray(furnitureIds) || furnitureIds.length === 0) {
      return res.status(400).json({ message: 'furnitureIds must be a non-empty array.' });
    }

    const user = await User.findById(userId).populate('cart');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the user's cart exists
    const cart = await Cart.findById(user.cart);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    // Loop through each furnitureId and add to the cart
    furnitureIds.forEach(furnitureId => {
      const itemIndex = cart.items.findIndex(item => item.furnitureId.toString() === furnitureId);

      if (itemIndex > -1) {
        // If the item already exists in the cart, update the quantity
        cart.items[itemIndex].quantity += 1; // Increment quantity (or adjust as necessary)
      } else {
        // If the item does not exist in the cart, add it with quantity 1
        cart.items.push({ furnitureId, quantity: 1 });
      }
    });

    // Recalculate the count and totalAmount after adding the items
    cart.count = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalAmount = await calculateTotalAmount(cart);

    await cart.save();

    res.status(200).json({ message: 'Items added to cart.', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Remove one or more items from the cart with check for already deleted items
exports.removeItemFromCart = async (req, res) => {
  try {
    const { userId } = req.params;
    let furnitureIds = req.body.furnitureIds; // Can be an array or a single furnitureId

    // If the request contains only a single furnitureId (not an array), convert it to an array
    if (!Array.isArray(furnitureIds)) {
      furnitureIds = [furnitureIds];
    }

    const user = await User.findById(userId).populate('cart');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const cart = await Cart.findById(user.cart);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    // List to store furnitureIds that are not found in the cart
    const notFoundItems = [];

    // Remove items that match any of the furnitureIds in the request
    cart.items = cart.items.filter(item => {
      if (furnitureIds.includes(item.furnitureId.toString())) {
        return false; // Item exists, so we remove it
      } else {
        notFoundItems.push(item.furnitureId.toString()); // Track items not found for feedback
        return true; // Item does not match, so keep it
      }
    });

    if (notFoundItems.length === furnitureIds.length) {
      return res.status(404).json({
        message: 'None of the specified items are present in the cart.',
        notFoundItems
      });
    }

    // Recalculate the count and totalAmount after removing the items
    cart.count = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalAmount = await calculateTotalAmount(cart);

    await cart.save();

    // Response including the removed items and any that were not found
    res.status(200).json({
      message: 'Items removed from cart.',
      removedItems: furnitureIds.filter(id => !notFoundItems.includes(id)),
      notFoundItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Update quantities of multiple items in the cart
exports.updateItemQuantities = async (req, res) => {
  try {
    const { userId } = req.params;
    const itemsToUpdate = req.body.items; // Expecting an array of { furnitureId, quantity }

    if (!Array.isArray(itemsToUpdate) || itemsToUpdate.length === 0) {
      return res.status(400).json({ message: 'items must be a non-empty array.' });
    }

    const user = await User.findById(userId).populate('cart');
    if (!user || !user.cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    let cart = await Cart.findById(user.cart);

    // Create a mapping of furnitureId to new quantity
    const updatesMap = {};
    for (const item of itemsToUpdate) {
      const { furnitureId, quantity } = item;

      if (quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1 for each item.' });
      }

      updatesMap[furnitureId] = quantity; // Store the new quantity for each furnitureId
    }

    // Update items in the cart
    for (const item of cart.items) {
      const newQuantity = updatesMap[item.furnitureId.toString()]; // Check if this item needs updating

      if (newQuantity !== undefined) {
        cart.count += (newQuantity - item.quantity); // Adjust the count based on the new quantity
        item.quantity = newQuantity; // Update the item quantity
      }
    }

    // Recalculate totalAmount
    cart.totalAmount = await calculateTotalAmount(cart);

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get cart by userId
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate({
      path: 'cart',
      populate: {
        path: 'items.furnitureId',
        model: 'Furniture',
      },
    });

    if (!user || !user.cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
