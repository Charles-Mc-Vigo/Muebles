import React, { useState } from 'react';
import Header from '../components/Header'; // Adjust path based on your project structure
import Footer from '../components/Footer'; // Adjust path based on your project structure

// Dummy cart items for demonstration
const cartItems = [
  { id: 1, name: 'N-Zio F S Box-M/SK LBR3', price: '₱15,990.00', quantity: 1, image: 'https://via.placeholder.com/100' },
];

const Cart = () => {
  const [items, setItems] = useState(cartItems);

  const totalPrice = items.reduce(
    (total, item) => total + parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity,
    0
  ).toFixed(2);

  const updateQuantity = (id, increment) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + increment) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Import the Header */}
      <Header />

      <main className="flex-grow max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>

        {items.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="border-t border-gray-300 py-4">
              <ul className="divide-y divide-gray-300">
                {items.map(item => (
                  <li key={item.id} className="flex items-center justify-between py-4">
                    <img src={item.image} alt={item.name} className="w-32 h-32 object-cover mr-4" />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <p className="text-gray-600">Price: {item.price}</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        className="px-3 py-1 border border-gray-400"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        -
                      </button>
                      <span className="px-4">{item.quantity}</span>
                      <button
                        className="px-3 py-1 border border-gray-400"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <p className="ml-4 text-lg font-medium">
                      ₱{(parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity).toFixed(2)}
                    </p>
                    <button
                      className="ml-4 text-red-600 hover:text-red-800"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-300 pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Subtotal:</h3>
                <p className="text-lg font-semibold">₱{totalPrice}</p>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                I have read and understood the terms and contents of the Privacy Policy, and give consent for data collection and processing.
              </p>

              <div className="flex justify-between">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  Continue Shopping
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded flex items-center">
                  <span className="mr-2">Check out</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17l3-3m0 0l3-3m-3 3V4m-7 16h14a2 2 0 002-2v-5a2 2 0 00-2-2h-5" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Import the Footer */}
      <Footer />
    </div>
  );
};

export default Cart;
