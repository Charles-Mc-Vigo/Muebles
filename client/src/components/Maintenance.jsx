import React, { useState, useEffect } from "react";
import axios from "axios";

const Maintenance = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [furnitureTypes, setFurnitureTypes] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [newItemName, setNewItemName] = useState("");

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to fetch categories. Please try again.");
    }
  };

  // Fetch furniture types
  const fetchFurnitureTypes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/furniture-types");
      setFurnitureTypes(response.data);
    } catch (error) {
      console.error("Error fetching furniture types:", error);
      alert("Failed to fetch furniture types. Please try again.");
    }
  };

  // Fetch furniture colors from the backend
  const fetchColors = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/colors");
      setColors(response.data);
    } catch (error) {
      console.error("Error fetching colors:", error);
      alert("Failed to fetch colors. Please try again.");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchColors();
    fetchFurnitureTypes();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/furnitures/furniture/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete the product. Please try again.");
    }
  };

  // Handle adding new item
  const handleAddNewItem = async () => {
    if (!newItemName || !selectedFilter) {
      alert("Please enter a valid name and select a filter.");
      return;
    }
    
    const newItem = { name: newItemName }; 
    try {
      let response;

      if (selectedFilter === "Categories") {
        response = await axios.post("http://localhost:3000/api/categories/add", newItem);
        setCategories((prevCategories) => [response.data, ...prevCategories]);
      } else if (selectedFilter === "Furniture Types") {
        response = await axios.post("http://localhost:3000/api/furniture-types/add", newItem);
        setFurnitureTypes((prevTypes) => [response.data, ...prevTypes]);
      } else if (selectedFilter === "Colors") {
        response = await axios.post("http://localhost:3000/api/colors/add", newItem);
        setColors((prevColors) => [response.data, ...prevColors]);
      }

      setNewItemName("");
      alert(`${selectedFilter} added successfully.`);
    } catch (error) {
      console.error(`Error adding new ${selectedFilter.toLowerCase()}:`, error);
      alert(`Failed to add ${selectedFilter.toLowerCase()}. Please try again.`);
    }
  };

  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="font-bold text-5xl mb-5">JCKAME Maintenance</h1>

      {/* Add New Item Form */}
      <div className="container w-3/4 mx-auto p-4 bg-gray-100 shadow-lg rounded-lg border-2 border-oliveGreen mb-10">
        <h2 className="text-xl font-bold mb-5">Add New Item</h2>

        <div className="mb-5 w-1/4">
          <label className="block mb-1">Select Type</label>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-full border-2 p-3 rounded-xl border-oliveGreen"
          >
            <option value="" disabled>Select Type</option>
            <option value="Categories">Categories</option>
            <option value="Furniture Types">Furniture Types</option>
            <option value="Colors">Colors</option>
            <option value="Furniture Size"> Furniture Size</option>
          </select>
        </div>

        <div className="mb-5 w-1/2">
          <label className="block mb-1">Item Name</label>
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="w-full border-2 p-3 rounded-xl border-oliveGreen"
            placeholder="Enter name"
          />
        </div>

        <button
          onClick={handleAddNewItem}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add {selectedFilter}
        </button>
      </div>

      {/* Data Table for old data */}
      <div className="container w-3/4 mx-auto p-4 bg-gray-100 shadow-lg rounded-lg border-2 border-oliveGreen">
        {selectedFilter ? (
          <>
            <h2 className="text-xl font-bold mb-2">{selectedFilter}</h2>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left border">Name</th>
                  <th className="px-4 py-2 text-left border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(selectedFilter === "Categories" ? categories : selectedFilter === "Furniture Types" ? furnitureTypes : colors).map((item) => (
                  <tr key={item._id} className="border-t">
                    <td className="px-4 py-2 border">{item.name}</td>
                    <td className="px-4 py-2 border">
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!(selectedFilter === "Categories" ? categories : selectedFilter === "Furniture Types" ? furnitureTypes : colors).length && (
                  <tr>
                    <td className="px-4 py-2 text-center border" colSpan="2">
                      No data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        ) : (
          <p className="text-center text-gray-500">Please select a filter to view data.</p>
        )}
      </div>
    </div>
  );
};

export default Maintenance;
