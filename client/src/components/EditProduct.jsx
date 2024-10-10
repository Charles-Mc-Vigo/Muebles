import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams(); // Use 'id' to match the route
  const [furnitureData, setFurnitureData] = useState({
    image: "",
    name: "",
    category: "",
    furnitureType: "",
    description: "",
    materials: [],
    colors: [],
    sizes: [],
    stocks: "",
    price: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`http://localhost:3000/api/furnitures/${id}`); // Fetching using id
      const data = await response.json();
      setFurnitureData(data); // Populate form with fetched data
    };
    
    fetchProduct();
  }, [id]);

  // Handle form submission as you planned
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFurnitureData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Make a PUT request to update the product
    const response = await fetch(`http://localhost:3000/api/furnitures/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(furnitureData),
    });

    if (response.ok) {
      toast.success('Product updated successfully!');
    } else {
      toast.error('Failed to update product.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            name="image"
            value={furnitureData.image}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={furnitureData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            value={furnitureData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700">Furniture Type</label>
          <input
            type="text"
            name="furnitureType"
            value={furnitureData.furnitureType}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={furnitureData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows="4"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700">Materials (comma separated)</label>
          <input
            type="text"
            name="materials"
            value={furnitureData.materials.join(', ')}
            onChange={(e) => handleInputChange({
              target: {
                name: 'materials',
                value: e.target.value.split(',').map(item => item.trim())
              }
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700">Colors (comma separated)</label>
          <input
            type="text"
            name="colors"
            value={furnitureData.colors.join(', ')}
            onChange={(e) => handleInputChange({
              target: {
                name: 'colors',
                value: e.target.value.split(',').map(item => item.trim())
              }
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700">Sizes (comma separated)</label>
          <input
            type="text"
            name="sizes"
            value={furnitureData.sizes.join(', ')}
            onChange={(e) => handleInputChange({
              target: {
                name: 'sizes',
                value: e.target.value.split(',').map(item => item.trim())
              }
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            name="stocks"
            value={furnitureData.stocks}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={furnitureData.price}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
  
        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;



