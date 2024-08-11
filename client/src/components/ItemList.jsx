// src/components/ItemList.jsx
import React from 'react';

// Expanded dummy data for items
const dummyItems = [
  { id: 1, name: 'Item 1', price: '$10.00', image: 'https://via.placeholder.com/150?text=Item+1' },
  { id: 2, name: 'Item 2', price: '$20.00', image: 'https://via.placeholder.com/150?text=Item+2' },
  { id: 3, name: 'Item 3', price: '$30.00', image: 'https://via.placeholder.com/150?text=Item+3' },
  { id: 4, name: 'Item 4', price: '$40.00', image: 'https://via.placeholder.com/150?text=Item+4' },
  { id: 5, name: 'Item 5', price: '$50.00', image: 'https://via.placeholder.com/150?text=Item+5' },
  { id: 6, name: 'Item 6', price: '$60.00', image: 'https://via.placeholder.com/150?text=Item+6' },
  { id: 7, name: 'Item 7', price: '$70.00', image: 'https://via.placeholder.com/150?text=Item+7' },
  { id: 8, name: 'Item 8', price: '$80.00', image: 'https://via.placeholder.com/150?text=Item+8' },
  { id: 9, name: 'Item 9', price: '$90.00', image: 'https://via.placeholder.com/150?text=Item+9' },
  { id: 10, name: 'Item 10', price: '$100.00', image: 'https://via.placeholder.com/150?text=Item+10' },
  { id: 11, name: 'Item 11', price: '$110.00', image: 'https://via.placeholder.com/150?text=Item+11' },
  { id: 12, name: 'Item 12', price: '$120.00', image: 'https://via.placeholder.com/150?text=Item+12' },
];

const ItemList = () => {
  return (
    <section className="p-4">
      <h2 className="text-xl font-semibold mb-4">Browse Items</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dummyItems.map(item => (
          <div key={item.id} className="border p-4 rounded-lg">
            <img src={item.image} alt={item.name} className="w-full h-32 object-cover mb-2" />
            <h3 className="text-lg font-medium">{item.name}</h3>
            <p className="text-gray-600">{item.price}</p>
            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ItemList;
