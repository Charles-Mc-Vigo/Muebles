import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import Header from '../components/Header';
import Footer from '../components/Footer';

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
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <div className="flex flex-1 overflow-hidden mt-5 mx-2 mb-2">
        {/* Left Section - Filter */}
        <div className="w-full md:w-1/5 p-4 border-2 border-oliveGreen rounded-lg overflow-y-auto mr-5" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Filter by Category</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Living Room</h3>
              <ul className="space-y-2">
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Coffee Tables
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    TV Console
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Cabinets
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Mini Shelves
                  </label>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Bedroom</h3>
              <ul className="space-y-2">
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Single Bedframes
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Double Bedframes
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Queen Bedframes
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    King Bedframes
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Dresser
                  </label>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Dining Room</h3>
              <ul className="space-y-2">
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Dining Table
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Dining Chair
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Dining Set
                  </label>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Chair/Sofa</h3>
              <ul className="space-y-2">
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Wooden Stools
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Rocking Chair
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    High Wooden Chairs
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Wooden Bench Chair
                  </label>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Door</h3>
              <ul className="space-y-2">
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Main Door
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Flush Door
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Panel Door
                  </label>
                </li>
                <li>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Door Jamb
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Section - Main Content */}
        <div className="flex-1 w-full md:w-3/4 p-4 border-2 border-oliveGreen overflow-y-auto rounded-lg mb-5" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Browse Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {furnitureList.length > 0 ? (
              furnitureList.map((item) => (
                <div key={item._id} className="border bg-white shadow-lg p-4 rounded-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={`data:image/jpeg;base64,${item.image}`}
                    alt={item.name}
                    className="w-full h-32 object-cover mb-3 rounded-lg"
                  />
                  <h1 className="text-lg font-medium text-gray-700 mt-2">{item.furnitureType}</h1>
                  <p className="font-mono text-sm text-gray-600 my-2">{item.description}</p>
                  <p className="text-lg text-gray-800 my-2">PHP {item.price}</p>
                  <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full w-full transition-colors duration-200">
                    Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600">Loading items...</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ItemList;
