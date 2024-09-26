import React from 'react';

const Inventory = () => {
  // Sample inventory items
  const woods = ['Oak', 'Pine', 'Walnut'];
  const paintColors = ['White', 'Espresso', 'Gray'];
  const otherItems = ['Nails', 'Glue', 'Screws'];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Furniture Shop Inventory</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Woods Category */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Woods</h2>
          <ul className="list-disc list-inside">
            {woods.map((wood, index) => (
              <li key={index} className="text-gray-700">{wood}</li>
            ))}
          </ul>
        </div>

        {/* Paint Color Category */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Paint Colors</h2>
          <ul className="list-disc list-inside">
            {paintColors.map((color, index) => (
              <li key={index} className="text-gray-700">{color}</li>
            ))}
          </ul>
        </div>

        {/* Other Inventory Items */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Other Inventory Items</h2>
          <ul className="list-disc list-inside">
            {otherItems.map((item, index) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
