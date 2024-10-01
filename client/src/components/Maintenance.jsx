import React, { useState, useEffect } from "react";
import axios from "axios";

const Maintenance = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [furnitureTypes, setFurnitureTypes] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [newItemName, setNewItemName] = useState("");
  const [newSize, setNewSize] = useState({
    label: "",
    height: "",
    length: "",
    width: "",
    depth: "",
    furnitureTypeId:""
  });

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
      const response = await axios.get(
        "http://localhost:3000/api/furniture-types"
      );
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

  // Fetch furniture sizes from the backend
  const fetchSizes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/sizes");
      setSizes(response.data);
    } catch (error) {
      console.error("Error fetching Furniture Size:", error);
      alert("Failed to fetch Size. Please try again.");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchColors();
    fetchFurnitureTypes();
    fetchSizes();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/furnitures/furniture/${id}`
      );
      setProducts(products.filter((product) => product._id !== id));
      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete the product. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target; 
    setNewSize((prevSize) => ({
      ...prevSize,
      [id]: value, 
    }));
  };

  // Handle adding new item
  const handleAddNewItem = async () => {
    if (!newItemName && selectedFilter !== "Furniture Size") {
      alert("Please enter a valid name.");
      return;
    }

    const newItem = { name: newItemName };

    try {
      let response;

      if (selectedFilter === "Categories") {
        response = await axios.post(
          "http://localhost:3000/api/categories/add",
          newItem
        );
        setCategories((prevCategories) => [response.data, ...prevCategories]);
      } else if (selectedFilter === "Furniture Types") {
        response = await axios.post(
          "http://localhost:3000/api/furniture-types/add",
          newItem
        );
        setFurnitureTypes((prevTypes) => [response.data, ...prevTypes]);
      } else if (selectedFilter === "Colors") {
        response = await axios.post(
          "http://localhost:3000/api/colors/add",
          newItem
        );
        setColors((prevColors) => [response.data, ...prevColors]);
      } else if (selectedFilter === "Furniture Size") {
        response = await axios.post(
          "http://localhost:3000/api/sizes/add",
          newSize
        );
        setSizes((prevSizes) => [response.data, ...prevSizes]);
      }
      setNewItemName(""); 
      setNewSize({ label: "", height: "", length: "", width: "", depth: "" }); 
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
            <option value="" disabled>
              Select Type
            </option>
            <option value="Categories">Categories</option>
            <option value="Furniture Types">Furniture Types</option>
            <option value="Colors">Furniture Colors</option>
            <option value="Furniture Size">Furniture Size</option>
          </select>
        </div>

        {/* Conditionally render the Item Name input field */}
        {selectedFilter !== "Furniture Size" && (
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
          
        )}

        {/* Conditionally render height, width, and depth fields if Furniture Size is selected */}
        {selectedFilter === "Furniture Size" && (
          <div className="flex space-x-5 mb-5 w-full">
            <div className="w-1/4">
              <label className="block mb-1">Select Category</label>
              <select
                name="filterCategory"
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setSelectedCategory(selectedValue);
                  const selectedFurnitureType = furnitureTypes.find(
                    (type) => type.name === selectedValue // Adjust based on how your categories are structured
                  );
                  setNewSize((prevSize) => ({
                    ...prevSize,
                    furnitureTypeId: selectedFurnitureType ? selectedFurnitureType._id : "", // Set the furnitureTypeId
                  }));
                }}
                value={selectedCategory}
                className="border-2 p-3 rounded-xl border-oliveGreen"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-5 w-1/2">
              <label className="block mb-1">Item Name</label>
              <input
                type="text"
                id="label"
                value={newSize.label}
                onChange={handleChange}
                className="w-full border-2 p-3 rounded-xl border-oliveGreen"
                placeholder="Enter name"
              />
            </div>
            <div className="w-1/3">
              <label className="block mb-1">Height (cm)</label>
              <input
                type="number"
                id="height"
                value={newSize.height}
                onChange={handleChange}
                className="w-full border-2 p-3 rounded-xl border-oliveGreen"
                placeholder="Enter height"
              />
            </div>
            <div className="w-1/3">
              <label className="block mb-1">Length (cm)</label>
              <input
                type="number"
                id="length"
                value={newSize.length}
                onChange={handleChange}
                className="w-full border-2 p-3 rounded-xl border-oliveGreen"
                placeholder="Enter length"
              />
            </div>
            <div className="w-1/3">
              <label className="block mb-1">Width (cm)</label>
              <input
                type="number"
                id="width"
                value={newSize.width}
                onChange={handleChange}
                className="w-full border-2 p-3 rounded-xl border-oliveGreen"
                placeholder="Enter width"
              />
            </div>
            <div className="w-1/3">
              <label className="block mb-1">Depth (cm)</label>
              <input
                type="number"
                id="depth"
                value={newSize.depth}
                onChange={handleChange}
                className="w-full border-2 p-3 rounded-xl border-oliveGreen"
                placeholder="Enter depth"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleAddNewItem}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add {selectedFilter}
        </button>
      </div>

      {/* Data Table for old data */}
      <div className="container w-3/4 mx-auto p-4 bg-gray-100 shadow-lg rounded-lg border-2 border-oliveGreen mb-10">
        <h2 className="text-xl font-bold mb-5">Existing Items</h2>
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
                {(selectedFilter === "Categories"
                  ? categories
                  : selectedFilter === "Furniture Types"
                  ? furnitureTypes
                  : selectedFilter === "Furniture Size"
                  ? sizes
                  : colors
                ).map((item) => (
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

                {(selectedFilter === "Categories"
                  ? categories
                  : selectedFilter === "Furniture Types"
                  ? furnitureTypes
                  : selectedFilter === "Furniture Size"
                  ? sizes
                  : colors
                ).length === 0 && (
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
          <p className="text-center text-gray-500">
            Please select a filter to view data.
          </p>
        )}
      </div>
    </div>
  );
};

export default Maintenance;
