import React from 'react';
import { FaCheck, FaEye, FaTimes } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Top Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Sales */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <p className="text-gray-500">Total Sales</p>
          <h2 className="text-3xl font-bold text-blue-600">₱0</h2>
          <p className="text-green-500">₱0</p>
        </div>
        {/* Total Revenue */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <p className="text-gray-500">Total Revenue</p>
          <h2 className="text-3xl font-bold text-blue-600">₱0</h2>
          <p className="text-green-500">₱0</p>
        </div>
        {/* Today's Visitors */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <p className="text-gray-500">Today's Visitors</p>
          <h2 className="text-3xl font-bold text-blue-600">0</h2>
          <p className="text-green-500">0</p>
        </div>
      </div>
      {/* Recent Orders Section */}
      <div className="mt-6 bg-white shadow-lg rounded-lg p-4">
        <h3 className="text-xl font-bold mb-4">New Orders</h3>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Purchase On</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Example row */}
            <tr>
              <td className="border px-4 py-2">Upuan</td>
              <td className="border px-4 py-2">#287695</td>
              <td className="border px-4 py-2">Dec 5th, 2020</td>
              <td className="border px-4 py-2">₱560.00</td>
              <td className="border px-4 py-2 flex space-x-2">
                <button className="text-green-500 hover:text-green-700">
                  <FaCheck />
                </button>
                <button className="text-blue-500 hover:text-blue-700">
                  <FaEye />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <FaTimes />
                </button>
              </td>
            </tr>
            {/* Repeat rows as necessary */}
          </tbody>
        </table>
      </div>
      {/* Delivery Progress */}
      <div className="mt-6 bg-white shadow-lg rounded-lg p-4">
        <h3 className="text-xl font-bold mb-4">Delivery Progress</h3>
        <ul>
          <li className="flex justify-between items-center mb-2">
            <span>Living Room</span>
            <div className="w-2/3 bg-gray-300 h-4 rounded-lg overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: '60%' }}></div>
            </div>
            <span className="ml-2 text-gray-500">60%</span>
          </li>
          <li className="flex justify-between items-center mb-2">
            <span>Bed Room</span>
            <div className="w-2/3 bg-gray-300 h-4 rounded-lg overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: '40%' }}></div>
            </div>
            <span className="ml-2 text-gray-500">40%</span>
          </li>
          <li className="flex justify-between items-center">
            <span>Dining Room</span>
            <div className="w-2/3 bg-gray-300 h-4 rounded-lg overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: '20%' }}></div>
            </div>
            <span className="ml-2 text-gray-500">20%</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;