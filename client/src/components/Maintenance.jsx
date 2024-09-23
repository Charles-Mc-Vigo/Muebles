import React, { useState } from 'react';

const FurnitureMaintenance = () => {
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [maintenanceData, setMaintenanceData] = useState([
    { id: 1, category: 'Living Room', type: 'Sofa', name: 'Leather Sofa', price: 1500, status: 'Updated' },
    { id: 2, category: 'Bedroom', type: 'Bed', name: 'King Size Bed', price: 1200, status: 'Not Updated' },
    { id: 3, category: 'Dining Room', type: 'Table', name: 'Wooden Dining Table', price: 900, status: 'Updated' },
  ]);

  const [selectedItem, setSelectedItem] = useState(null);

  const handleFilter = () => {
    return maintenanceData.filter(item => {
      return (
        (filterCategory === '' || item.category === filterCategory) &&
        (filterType === '' || item.type === filterType)
      );
    });
  };

  const handleUpdateClick = (item) => {
    setSelectedItem(item); // Set the item to be updated
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Update the maintenance data with the new values
    const updatedData = maintenanceData.map((item) =>
      item.id === selectedItem.id ? selectedItem : item
    );
    setMaintenanceData(updatedData);
    setSelectedItem(null); // Close the form after update
  };

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        {/* Filter */}
        <select
          className="mr-2 p-2 border border-gray-300 rounded"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">Filter by Category</option>
          <option value="Living Room">Living Room</option>
          <option value="Bedroom">Bedroom</option>
          <option value="Dining Room">Dining Room</option>
        </select>
        <select
          className="p-2 border border-gray-300 rounded"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Filter by Type</option>
          <option value="Sofa">Sofa</option>
          <option value="Bed">Bed</option>
          <option value="Table">Table</option>
        </select>
      </div>

      {/* Maintenance Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {handleFilter().map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-2">{item.category}</td>
              <td className="px-4 py-2">{item.type}</td>
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.price}</td>
              <td className="px-4 py-2">{item.status}</td>
              <td className="px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => handleUpdateClick(item)}
                >
                  Update
                </button>
                <button className="bg-red-500 text-white px-2 py-1 ml-2 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Update Furniture</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block">Category:</label>
                <select
                  className="p-2 border border-gray-300 rounded w-full"
                  value={selectedItem.category}
                  onChange={(e) => setSelectedItem({ ...selectedItem, category: e.target.value })}
                >
                  <option value="Living Room">Living Room</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Dining Room">Dining Room</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block">Type:</label>
                <input
                  className="p-2 border border-gray-300 rounded w-full"
                  type="text"
                  value={selectedItem.type}
                  onChange={(e) => setSelectedItem({ ...selectedItem, type: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block">Name:</label>
                <input
                  className="p-2 border border-gray-300 rounded w-full"
                  type="text"
                  value={selectedItem.name}
                  onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block">Price:</label>
                <input
                  className="p-2 border border-gray-300 rounded w-full"
                  type="number"
                  value={selectedItem.price}
                  onChange={(e) => setSelectedItem({ ...selectedItem, price: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block">Status:</label>
                <select
                  className="p-2 border border-gray-300 rounded w-full"
                  value={selectedItem.status}
                  onChange={(e) => setSelectedItem({ ...selectedItem, status: e.target.value })}
                >
                  <option value="Updated">Updated</option>
                  <option value="Not Updated">Not Updated</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  type="submit"
                >
                  Save
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setSelectedItem(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FurnitureMaintenance;
