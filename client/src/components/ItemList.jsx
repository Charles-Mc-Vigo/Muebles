import React, { useEffect, useState } from 'react';
import axios from 'axios'; 

const ItemList = () => {
  const [furnitureList, setFurnitureList] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/furnitures');
        setFurnitureList(response.data);
      } catch (error) {
        console.error('Error fetching furniture:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="p-4">
      <h2 className="text-xl font-semibold mb-4">Browse Items</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {furnitureList.length > 0 ? (
          furnitureList.map(item => (
            <div key={item._id} className="border p-4 rounded-lg">
              <img src={`data:image/jpeg;base64,${item.image}`} alt={item.name} className="w-full h-32 object-cover mb-2" />
              <h1 className="text-lg font-medium mt-4">{item.furnitureType}</h1>
              <p className="font-mono my-2">{item.description}</p>
              <p className="text-gray-600 my-2">PHP {item.price}</p>
              <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>Loading items...</p>
        )}
      </div>
    </section>
  );
}

export default ItemList;
