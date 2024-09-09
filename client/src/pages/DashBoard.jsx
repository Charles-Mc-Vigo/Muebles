import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const DashBoard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('adminToken');
    navigate('/admin-login');
    console.log('Logging out...');
  };

  const navigateToSection = (section) => {
    navigate(`/${section}`);
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <nav className="w-64 bg-green-900 text-white flex flex-col justify-center">
        <div className="p-6 text-xl font-bold text-center bg-green-800">
          Admin Dashboard
        </div>
        <ul className="flex-1">
          <li
            className="p-4 hover:bg-green-700 cursor-pointer transition-colors"
            onClick={() => navigateToSection('user-management')}
          >
            User Management
          </li>
          <li
            className="p-4 hover:bg-green-700 cursor-pointer transition-colors"
            onClick={() => navigateToSection('order-management')}
          >
            Order Management
          </li>
          <li
            className="p-4 hover:bg-green-700 cursor-pointer transition-colors"
            onClick={() => navigateToSection('product-management')}
          >
            Furniture Product Management
          </li>
          <li
            className="p-4 hover:bg-green-700 cursor-pointer transition-colors"
            onClick={() => navigateToSection('product-customization')}
          >
            Product Customization
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white p-4 mt-auto hover:bg-red-700 w-full transition-colors"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-black text-white overflow-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-green-500">
          Admin Dashboard Overview
        </h1>

        {/* Order Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-green-900 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold mb-2 text-green-400">Today's Orders</h2>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="bg-green-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold mb-2 text-green-400">Total Orders</h2>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="bg-green-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold mb-2 text-green-400">Pending Orders</h2>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="bg-green-600 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold mb-2 text-green-400">Cancelled Orders</h2>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-green-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-400">Recent Orders</h2>
          <table className="w-full table-auto border-collapse text-left">
            <thead>
              <tr className="bg-green-800 text-white">
                <th className="p-3 border-b border-green-700">Order ID</th>
                <th className="p-3 border-b border-green-700">Customer</th>
                <th className="p-3 border-b border-green-700">Status</th>
                <th className="p-3 border-b border-green-700">Total</th>
                <th className="p-3 border-b border-green-700">Date</th>
                <th className="p-3 border-b border-green-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty state for now */}
              <tr>
                <td className="p-3 text-center text-green-400" colSpan="6">
                  No orders available.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
