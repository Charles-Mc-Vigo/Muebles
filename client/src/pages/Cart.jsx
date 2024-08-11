// src/pages/Cart.jsx
import React from 'react';

// Dummy cart items for demonstration
const cartItems = [
  { id: 1, name: 'Item 1', price: '$10.00', quantity: 2, image: 'https://via.placeholder.com/100?text=Item+1' },
  { id: 2, name: 'Item 2', price: '$20.00', quantity: 1, image: 'https://via.placeholder.com/100?text=Item+2' },
  { id: 3, name: 'Item 3', price: '$30.00', quantity: 3, image: 'https://via.placeholder.com/100?text=Item+3' },
];

const Cart = () => {
  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + parseFloat(item.price.replace('$', '')) * item.quantity, 0).toFixed(2);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
      <div className="border-t border-gray-300">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          <div>
            <ul className="divide-y divide-gray-300">
              {cartItems.map(item => (
                <li key={item.id} className="flex items-center justify-between p-4">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover mr-4" />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-600">Price: {item.price}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <button className="bg-red-500 text-white px-4 py-2 rounded ml-4">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between items-center border-t border-gray-300 pt-4">
              <h3 className="text-lg font-semibold">Total:</h3>
              <p className="text-lg font-semibold">${totalPrice}</p>
            </div>
            <div className="mt-4 flex justify-between">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Continue Shopping
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
