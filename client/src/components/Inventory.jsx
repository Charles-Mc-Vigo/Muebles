import React, { useState } from 'react';

const InventoryManagement = () => {
  // Dummy data for inventory
  //  pwede din wag na isama product description tapos sa quantity ay di ako sure kase nakalagay sa docs ni myca ay yung quantity ay varies
  const inventory = [
    { productName: 'Mahogany', productDescription: 'Uses: Cabinets, tables, chairs, bed frames', sizes: '1x2 ft, 2x4 ft, 4x8 ft planks', quantity: 'Varies' },
    { productName: 'Narra', productDescription: 'Uses: High-end furniture, flooring, dining sets', sizes: '2x4 ft, 4x8 ft planks', quantity: 'Varies' },
    { productName: 'Acacia', productDescription: 'Uses: Outdoor furniture, coffee tables, benches', sizes: '1x2 ft, 3x6 ft, 4x8 ft planks', quantity: 'Varies' },
    { productName: 'Foam', productDescription: 'Uses: Upholstery', sizes: 'High-density, medium-density', quantity: 'Varies' },
    { productName: 'Wood Glue', productDescription: 'Heavy-duty adhesive for joint work', sizes: 'N/A', quantity: 'Available in gallons' },
    { productName: 'Epoxy Resin', productDescription: 'Clear resin for finishes', sizes: 'Available in tubes and gallons', quantity: 'Varies' },
    { productName: 'Wood Stain', productDescription: 'For wood coloring and enhancing grain', sizes: 'Walnut, Mahogany, Clear Gloss', quantity: 'Varies' },
    { productName: 'Varnish/Polyurethane', productDescription: 'Protective finish for wood', sizes: 'Gloss, Semi-gloss, Matte', quantity: 'Varies' },
    { productName: 'Nails', productDescription: 'Fastening hardware', sizes: 'Various sizes', quantity: 'Varies' },
    { productName: 'Screws', productDescription: 'Fastening hardware', sizes: 'Various sizes', quantity: 'Varies' },
    { productName: 'Brackets', productDescription: 'Used for support and joint reinforcement', sizes: 'L-shaped, flat, decorative', quantity: 'Varies' },
    { productName: 'Hinges', productDescription: 'Used for doors, cabinets, lids, rotating joints', sizes: 'Butt, Concealed, Piano, Pivot', quantity: 'Varies' },
    { productName: 'Sandpaper', productDescription: 'Used for smoothing and preparing surfaces', sizes: 'Coarse, Medium, Fine, Very Fine', quantity: 'Varies' },
  ];

  // State for search term
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered inventory based on search term
  const filteredInventory = inventory.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
      
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by product name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-600">
                Product Name
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-600">
                Product Description
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-600">
                Sizes
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-600">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-800">
                  {item.productName}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-800">
                  {item.productDescription}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-800">
                  {item.sizes}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-800">
                  {item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManagement;
