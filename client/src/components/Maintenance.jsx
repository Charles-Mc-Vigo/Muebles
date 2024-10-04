import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Maintenance = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [furnitureTypes, setFurnitureTypes] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedFurnitureType, setSelectedFurnitureType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [loading, setLoading] = useState(false);
  const [newSize, setNewSize] = useState({
    label: "",
    height: "",
    length: "",
    width: "",
    depth: "",
    furnitureTypeId: "",
  });
  const [newColor, setNewColor] = useState({
    name: "",
    rgb: "",
    hex: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        categoriesResponse,
        furnitureTypesResponse,
        colorsResponse,
        sizesResponse,
      ] = await Promise.all([
        axios.get("http://localhost:3000/api/categories"),
        axios.get("http://localhost:3000/api/furniture-types"),
        axios.get("http://localhost:3000/api/colors"),
        axios.get("http://localhost:3000/api/sizes"),
      ]);
      setCategories(categoriesResponse.data);
      setFurnitureTypes(furnitureTypesResponse.data);
      setColors(colorsResponse.data);
      setSizes(sizesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/furnitures/furniture/${id}`);
      setProducts(products.filter((product) => product._id !== id));
      toast.success("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete the product. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setNewSize((prevSize) => ({
      ...prevSize,
      [id]: value,
    }));
  };

  const handleColorChange = (e) => {
    const { name, value } = e.target;
    setNewColor((prevColor) => ({
      ...prevColor,
      [name]: value,
    }));
  };

  const handleAddNewItem = async () => {
    if (!newItemName && selectedFilter !== "Furniture Size" && selectedFilter !== "Colors") {
      toast.error("Please enter a valid name.");
      return;
    }

    let newItem;
    if (selectedFilter === "Furniture Size") {
      newItem = { ...newSize };
    } else if (selectedFilter === "Colors") {
      newItem = { ...newColor };
    } else {
      newItem = { name: newItemName };
    }

    try {
      const endpoints = {
        Categories: "http://localhost:3000/api/categories/add",
        "Furniture Types": "http://localhost:3000/api/furniture-types/add",
        Colors: "http://localhost:3000/api/colors/add",
        "Furniture Size": "http://localhost:3000/api/sizes/add",
      };

      if (selectedFilter === "Furniture Types") {
        newItem.categoryId = selectedCategory;
      }

      const response = await axios.post(endpoints[selectedFilter], newItem, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (selectedFilter === "Categories") {
        setCategories((prev) => [response.data, ...prev]);
      } else if (selectedFilter === "Furniture Types") {
        setFurnitureTypes((prev) => [response.data, ...prev]);
      } else if (selectedFilter === "Colors") {
        setColors((prev) => [response.data, ...prev]);
      } else if (selectedFilter === "Furniture Size") {
        setSizes((prev) => [response.data, ...prev]);
      }

      resetInputFields();
      toast.success(`${selectedFilter} added successfully.`);
    } catch (error) {
      console.error(`Error adding new ${selectedFilter.toLowerCase()}:`, error);
      toast.error(`Failed to add ${selectedFilter.toLowerCase()}. Please try again.`);
    }
  };

  const resetInputFields = () => {
    setNewItemName("");
    setNewColor({ name: "", rgb: "", hex: "" });
    setNewSize({
      label: "",
      height: "",
      length: "",
      width: "",
      depth: "",
      furnitureTypeId: "",
    });
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

        {selectedFilter === "Colors" && (
          <>
            <div className="mb-5 w-1/2">
              <label className="block mb-1">Color Name</label>
              <input
                type="text"
                name="name"
                value={newColor.name}
                onChange={handleColorChange}
                className="w-full border-2 p-3 rounded-xl border-oliveGreen"
                placeholder="Enter color name"
              />
            </div>
            <div className="mb-5 w-1/2">
              <label className="block mb-1">RGB Value</label>
              <input
                type="text"
                name="rgb"
                value={newColor.rgb}
                onChange={handleColorChange}
                className="w-full border-2 p-3 rounded-xl border-oliveGreen"
                placeholder="Enter RGB value (e.g., rgb(255, 0, 0))"
              />
            </div>
            <div className="mb-5 w-1/2">
              <label className="block mb-1">Hex Value</label>
              <input
                type="text"
                name="hex"
                value={newColor.hex}
                onChange={handleColorChange}
                className="w-full border-2 p-3 rounded-xl border-oliveGreen"
                placeholder="Enter hex value (e.g., #FF0000)"
              />
            </div>
          </>
        )}

        {selectedFilter !== "Furniture Size" && selectedFilter !== "Furniture Types" && selectedFilter !== "Colors" && (
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
          <div className="flex space-x-5 mb-2 w-full">
            <div className="flex-1 mb-4">
              
              <label className="block mb-1">Select Furniture Type</label>
              <select
                name="filterFurnitureTypes"
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setSelectedFurnitureType(selectedValue);
                  const selectedFurniture = furnitureTypes.find(
                    (type) => type.name === selectedValue
                  );
                  setNewSize((prev) => ({
                    ...prev,
                    furnitureTypeId: selectedFurniture ? selectedFurniture._id : "",
                  }));
                }}
                value={selectedFurnitureType}
                className="border-2 p-3 rounded-xl border-oliveGreen w-full"
              >
                <option value="">Select Furniture Types</option>
                {furnitureTypes.map((furnitureType) => (
                  <option key={furnitureType._id} value={furnitureType.name}>
                    {furnitureType.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 mb-4">
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
            {["width", "length", "height", "depth"].map((dim) => (
              <div className="flex-1 mb-4" key={dim}>
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

        {selectedFilter === "Furniture Types" && (
          <div className="flex mb-5">
            <div className="flex-1">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full border-2 p-3 rounded-xl border-oliveGreen"
                placeholder="Enter furniture type name"
              />
            </div>
            <div className="ml-4 flex-1">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border-2 p-3 rounded-xl border-oliveGreen"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="mb-5">
          <button
            onClick={handleAddNewItem}
            className="bg-oliveGreen text-white px-4 py-2 rounded-lg"
          >
            Add New Item
          </button>
        </div>
      </div>

      {/* Display Tables */}
      <div className="container w-3/4 mx-auto">
        {selectedFilter === "Categories" && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-lg border-2 border-oliveGreen mb-10">
            <h3 className="font-bold mb-3">Categories</h3>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Category Name</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Furniture */}
        {selectedFilter === "Furniture Types" && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-lg border-2 border-oliveGreen mb-10">
            <h3 className="font-bold mb-3">Furniture Types</h3>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Furniture Type</th>
                  <th className="border border-gray-300 px-4 py-2">Category</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {furnitureTypes.map((type) => {
                  const category = categories.find((cat) => cat._id === type.categoryId);
                  return (
                    <tr key={type._id}>
                      <td className="border border-gray-300 px-4 py-2">{type.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{category ? category.name : "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() => handleDelete(type._id)}
                          className="bg-red-600 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {selectedFilter === "Colors" && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-lg border-2 border-oliveGreen mb-10">
            <h3 className="font-bold mb-3">Colors</h3>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Color Name</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {colors.map((color) => (
                  <tr key={color._id}>
                    <td className="border border-gray-300 px-4 py-2">{color.name}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleDelete(color._id)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedFilter === "Furniture Size" && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-lg border-2 border-oliveGreen mb-10">
            <h3 className="font-bold mb-3">Furniture Sizes</h3>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Label</th>
                  <th className="border border-gray-300 px-4 py-2">Width (cm)</th>
                  <th className="border border-gray-300 px-4 py-2">Length (cm)</th>
                  <th className="border border-gray-300 px-4 py-2">Height (cm)</th>
                  <th className="border border-gray-300 px-4 py-2">Depth (cm)</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((size) => (
                  <tr key={size._id}>
                    <td className="border border-gray-300 px-4 py-2">{size.label}</td>
                    <td className="border border-gray-300 px-4 py-2">{size.height}</td>
                    <td className="border border-gray-300 px-4 py-2">{size.length}</td>
                    <td className="border border-gray-300 px-4 py-2">{size.width}</td>
                    <td className="border border-gray-300 px-4 py-2">{size.depth}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleDelete(size._id)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Maintenance;