import React, { useState } from 'react';
import axios from 'axios';
const ProductManagement = () => {
  const [product, setProduct] = useState({
    image: null,
    category: '',
    furnitureType: '',
    description: '',
    price: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageUpload = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:3000/api/furnitures/create",
				{
					...product
				}
			);

      console.log(response);
      alert("Furniture added successfully!");
		} catch (error) {
			console.error("Error adding new furniture", error.response?.data || error.message);
			alert(error.response?.data?.message || error.message || "Adding Furniture failed");
		}
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Product Management</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Upload Furniture Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
        </div>

        {/* Category Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleInputChange}
            placeholder="e.g., Living Room"
            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Furniture Type Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Furniture Type</label>
          <input
            type="text"
            name="type"
            value={product.furnitureType}
            onChange={handleInputChange}
            placeholder="e.g., Sofa"
            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleInputChange}
            placeholder="Enter a detailed description..."
            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            rows="4"
          />
        </div>

        {/* Price Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Price ($)</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            placeholder="e.g., 299.99"
            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default ProductManagement;
