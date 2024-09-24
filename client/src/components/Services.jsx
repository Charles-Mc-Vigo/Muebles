import React, { useState } from 'react';

const ServiceSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const categories = ['Living Room', 'Bedroom', 'Dining Room'];
  const types = []; // Add types later when needed

  const products = [
    { name: 'Sofa', category: 'Living Room', type: 'Couch' },
    { name: 'Bed', category: 'Bedroom', type: 'King Size' },
    { name: 'Dining Table', category: 'Dining Room', type: 'Round' },
  ];

  const filteredProducts = products.filter(product => 
    (selectedCategory === '' || product.category === selectedCategory) &&
    (selectedType === '' || product.type === selectedType)
  );

  return (
    <div className="p-4">
      {/* Filter Dropdowns */}
      <div className="mb-4 flex gap-4">
        {/* Category Dropdown */}
        <select
          className="border-2 border-gray-300 p-2 rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Type Dropdown */}
        <select
          className="border-2 border-gray-300 p-2 rounded"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          disabled={types.length === 0}
        >
          <option value="">All Types</option>
          {types.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Table for Displaying Products */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Product Name</th>
            <th className="py-2 px-4 border">Category</th>
            <th className="py-2 px-4 border">Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border">{product.name}</td>
              <td className="py-2 px-4 border">{product.category}</td>
              <td className="py-2 px-4 border">{product.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceSection;
