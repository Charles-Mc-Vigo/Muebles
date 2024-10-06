import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductTable = () => {
  const [furnitures, setFurnitures] = useState([]); // State to hold furniture data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle error

  // Fetch furniture data from API
  useEffect(() => {
    const fetchFurnitures = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/furnitures');
        setFurnitures(response.data); // Set the fetched data into state
      } catch (error) {
        setError('Error fetching furniture data'); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchFurnitures();
  }, []); // Empty dependency array to run only on mount

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>{error}</div>; // Error state
  }

  return (
    <div className="overflow-auto">
      <table className="min-w-full bg-white border border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Materials</th>
            <th className="border px-4 py-2">Colors</th>
            <th className="border px-4 py-2">Sizes</th>
            <th className="border px-4 py-2">Stocks</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {furnitures.map((furniture) => (
            <tr key={furniture._id}>
              <td className="border px-4 py-2">
                <img
                  src={furniture.image ? `data:image/jpeg;base64,${furniture.image}` : 'default-image-url.jpg'} // Use a default image if not available
                  alt={furniture.name}
                  className="w-16 h-16 object-cover"
                />
              </td>
              <td className="border px-4 py-2">{furniture.name}</td>
              <td className="border px-4 py-2">{furniture.category.name}</td> {/* Assuming category has a name field */}
              <td className="border px-4 py-2">{furniture.furnitureType.name}</td> {/* Assuming furnitureType has a name field */}
              <td className="border px-4 py-2">{furniture.description}</td>
              <td className="border px-4 py-2">{furniture.materials.map(material => material.name).join(", ")}</td>
              <td className="border px-4 py-2">{furniture.colors.map(color => color.name).join(", ")}</td>
              <td className="border px-4 py-2">{furniture.sizes.map(size => size.label).join(", ")}</td>
              <td className="border px-4 py-2">{furniture.stocks.stocks}</td> {/* Adjust based on your stocks structure */}
              <td className="border px-4 py-2">{furniture.price}</td>
              <td className="border px-4 py-2">
                <button className="bg-blue-500 text-white p-1 rounded">Edit</button>
                <button className="bg-red-500 text-white p-1 rounded ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;