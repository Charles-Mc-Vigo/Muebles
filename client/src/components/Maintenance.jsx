import React, { useState, useEffect } from "react";
import axios from "axios";

const Maintenance = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [furnitureTypes, setFurnitureTypes] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedFurnitureType, setSelectedFurnitureType] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newSize, setNewSize] = useState({
    label: "",
    height: "",
    length: "",
    width: "",
    depth: "",
    furnitureTypeId: ""
  });

  // Fetch data from the backend
  const fetchData = async () => {
    try {
      const [categoriesResponse, furnitureTypesResponse, colorsResponse, sizesResponse] = await Promise.all([
        axios.get("http://localhost:3000/api/categories"),
        axios.get("http://localhost:3000/api/furniture-types"),
        axios.get("http://localhost:3000/api/colors"),
        axios.get("http://localhost:3000/api/sizes")
      ]);

      setCategories(categoriesResponse.data);
      setFurnitureTypes(furnitureTypesResponse.data);
      setColors(colorsResponse.data);
      setSizes(sizesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
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

  const newItem = selectedFilter === "Furniture Size" ? { ...newSize } : { name: newItemName };

  try {
      let response;
      const endpoints = {
          Categories: "http://localhost:3000/api/categories/add",
          "Furniture Types": "http://localhost:3000/api/furniture-types/add",
          Colors: "http://localhost:3000/api/colors/add",
          "Furniture Size": "http://localhost:3000/api/sizes/add",
      };

      response = await axios.post(endpoints[selectedFilter], newItem, {
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (selectedFilter === "Categories") {
          setCategories((prev) => [response.data, ...prev]);
      } else if (selectedFilter === "Furniture Types") {
          setFurnitureTypes((prev) => [response.data, ...prev]);
      } else if (selectedFilter === "Colors") {
          setColors((prev) => [response.data, ...prev]);
      } else if (selectedFilter === "Furniture Size") {
          // Prepend the new size to the existing sizes
          setSizes((prev) => [response.data, ...prev]);
      }

      setNewItemName("");
      setNewSize({ label: "", height: "", length: "", width: "", depth: "", furnitureTypeId: "" });
      alert(`${selectedFilter} added successfully.`);
  } catch (error) {
      console.error(`Error adding new ${selectedFilter.toLowerCase()}:`, error);
      alert(`Failed to add ${selectedFilter.toLowerCase()}. Please try again.`);
  }
};

  return (
    <div className="flex flex-col items-center py-10">
      <h1 className="font-bold text-5xl mb-5">JCKAME Maintenance</h1>
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
            <option value="Colors">Furniture Colors</option>
            <option value="Furniture Size">Furniture Size</option>
          </select>
        </div>
        
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

        {selectedFilter === "Furniture Size" && (
          <div className="flex space-x-5 mb-5 w-full">
            <div className="w-1/4">
              <label className="block mb-1">Select Furniture Types</label>
              <select
                name="filterFurnitureTypes"
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setSelectedFurnitureType(selectedValue);
                  const selectedFurniture = furnitureTypes.find(type => type.name === selectedValue);
                  setNewSize(prev => ({
                    ...prev,
                    furnitureTypeId: selectedFurniture ? selectedFurniture._id : "",
                  }));
                }}
                value={selectedFurnitureType}
                className="border-2 p-3 rounded-xl border-oliveGreen"
              >
                <option value="">All Furniture Types</option>
                {furnitureTypes.map(furnitureType => (
                  <option key={furnitureType._id} value={furnitureType.name}>
                    {furnitureType.name}
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
            {['height', 'length', 'width', 'depth'].map((dim) => (
              <div className="w-1/3" key={dim}>
                <label className="block mb-1">{dim.charAt(0).toUpperCase() + dim.slice(1)} (cm)</label>
                <input
                  type="number"
                  id={dim}
                  value={newSize[dim]}
                  onChange={handleChange}
                  className="w-full border-2 p-3 rounded-xl border-oliveGreen"
                  placeholder={`Enter ${dim}`}
                />
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleAddNewItem}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add {selectedFilter}
        </button>
      </div>

      <div className="container w-3/4 mx-auto p-4 bg-gray-100 shadow-lg rounded-lg border-2 border-oliveGreen mb-10">
        <h2 className="text-xl font-bold mb-5">Existing Items</h2>
        {selectedFilter ? (
          <>
            <h2 className="text-xl font-bold mb-2">{selectedFilter}</h2>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  {selectedFilter === "Furniture Size" ? (
                    <>
                      <th className="px-4 py-2 text-left border">Label</th>
                      <th className="px-4 py-2 text-left border">Height (cm)</th>
                      <th className="px-4 py-2 text-left border">Length (cm)</th>
                      <th className="px-4 py-2 text-left border">Width (cm)</th>
                      <th className="px-4 py-2 text-left border">Depth (cm)</th>
                      <th className="px-4 py-2 text-left border">Furniture Type</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-2 text-left border">Name</th>
                    </>
                  )}
                  <th className="px-4 py-2 text-left border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedFilter === "Furniture Size" ? (
                  sizes.map((item) => {
                    // Find the furniture type name based on the furnitureTypeId
                    const furnitureType = furnitureTypes.find(type => type._id === item.furnitureTypeId);
                    return (
                      <tr key={item._id} className="border-t">
                        <td className="px-4 py-2 border">{item.label}</td>
                        <td className="px-4 py-2 border">{item.height}</td>
                        <td className="px-4 py-2 border">{item.length}</td>
                        <td className="px-4 py-2 border">{item.width}</td>
                        <td className="px-4 py-2 border">{item.depth}</td>
                        <td className="px-4 py-2 border">{furnitureType ? furnitureType.name : "N/A"}</td>
                        <td className="px-4 py-2 border">
                          <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  (selectedFilter === "Categories"
                    ? categories
                    : selectedFilter === "Furniture Types"
                    ? furnitureTypes
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
                  ))
                )}
                {(selectedFilter === "Categories"
                  ? categories
                  : selectedFilter === "Furniture Types"
                  ? furnitureTypes
                  : selectedFilter === "Furniture Size"
                  ? sizes
                  : colors
                ).length === 0 && (
                  <tr>
                    <td className="px-4 py-2 text-center border" colSpan={selectedFilter === "Furniture Size" ? 7 : 2}>
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