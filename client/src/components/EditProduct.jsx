import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditProduct = () => {
  const { furnitureId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [furnitureData, setFurnitureData] = useState({
    images: [],
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
  const [originalData, setOriginalData] = useState({}); // Store original data
  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const fetchFurnitureData = async () => {
      setIsFetching(true);
      try {
        const response = await fetch(`http://localhost:3000/api/furnitures/${furnitureId}`, {
          method: 'GET',
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch furniture data');
        }
        const data = await response.json();
        console.log(data)
        // Transform the data to match the form structure
        const transformedData = {
          name: data.name,
          description: data.description,
          price: data.price,
          stocks: data.stocks.stocks,
          category: data.category?.name || '',
          furnitureType: data.furnitureType?.name || '',
          materials: data.materials?.map(material => material.name) || [],
          colors: data.colors?.map(color => color.name) || [],
          sizes: data.sizes?.map(size => size.label) || [],
          images: data.images || [],
        };
        setFurnitureData(transformedData);
        setOriginalData(transformedData); // Store original data for reference
        // Handle images
        if (data.images && data.images.length > 0) {
          const imageUrls = data.images.map(img => img.startsWith('data:') ? img : `data:image/jpeg;base64,${img}`);
          setPreviewImages(imageUrls);
        }
        toast.success('Product data loaded successfully');
      } catch (error) {
        console.error('Error fetching furniture data:', error);
        toast.error('Failed to load product data');
      } finally {
        setIsFetching(false);
      }
    };
    fetchFurnitureData();
  }, [furnitureId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFurnitureData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleArrayInputChange = (e, field) => {
    const values = e.target.value.split(',').map(item => item.trim()).filter(item => item);
    setFurnitureData(prevData => ({
      ...prevData,
      [field]: values,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prevFiles => [...prevFiles, ...files]);
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prevPreviews => [...prevPreviews, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (previewImages.length < 5) {
        toast.error('At least 5 images are required!');
        return;
      }
      const formData = new FormData();
      // Append only modified fields to formData
      Object.keys(furnitureData).forEach(key => {
        if (furnitureData[key] !== originalData[key]) {
          if (Array.isArray(furnitureData[key])) {
            furnitureData[key].forEach(value => {
              formData.append(key, value);
            });
          } else {
            formData.append(key, furnitureData[key]);
          }
        }
      });
      // Append new image files
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`http://localhost:3000/api/furnitures/edit/${furnitureId}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update product');
      }
      toast.success('Product updated successfully!');
      navigate('/products'); // Adjust the route as needed
    } catch (error) {
      toast.error(error.message || 'Failed to update product');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading product data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images (Minimum 5 required)
          </label>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {previewImages.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <p className="mt-2 text-sm text-gray-500">
            Current images: {previewImages.length} (Minimum 5 required)
          </p>
        </div>
        {/* Product Details Section */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={furnitureData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={furnitureData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Furniture Type</label>
            <input
              type="text"
              name="furnitureType"
              value={furnitureData.furnitureType}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={furnitureData.price}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              name="stocks"
              value={furnitureData.stocks}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={furnitureData.description}
            onChange={handleInputChange}
            rows="4"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        {/* Arrays Section */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Materials (comma separated)
            </label>
            <input
              type="text"
              value={furnitureData.materials.join(', ')}
              onChange={(e) => handleArrayInputChange(e, 'materials')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Colors (comma separated)
            </label>
            <input
              type="text"
              value={furnitureData.colors.join(', ')}
              onChange={(e) => handleArrayInputChange(e, 'colors')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sizes (comma separated)
            </label>
            <input
              type="text"
              value={furnitureData.sizes.join(', ')}
              onChange={(e) => handleArrayInputChange(e, 'sizes')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 bg-indigo-600 text-white font-medium py-3 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Updating...' : 'Update Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;