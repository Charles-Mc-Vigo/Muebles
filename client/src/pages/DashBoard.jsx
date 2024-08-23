import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const DashBoard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('adminToken');
    navigate('/admin');
    console.log('Logging out...');
  };

  const navigateToSection = (section) => {
    navigate(`/${section}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-800 text-white flex flex-col justify-center text-center">
        <div className="p-4 text-xl font-bold text-center">Admin Dashboard</div>
        <ul className="flex-1">
          <li
            className="p-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => navigateToSection('user-management')}
          >
            User Management
          </li>
          <li
            className="p-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => navigateToSection('order-management')}
          >
            Order Management
          </li>
          <li
            className="p-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => navigateToSection('product-management')}
          >
            Furniture Product Management
          </li>
          <li
            className="p-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => navigateToSection('product-customization')}
          >
            Product Customization
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white p-4 mt-auto hover:bg-red-700 w-full"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard Overview</h1>
        {/* Order Statistics Section */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <h2 className="text-lg font-semibold">Today's Orders</h2>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-cyan-200 p-4 rounded-lg shadow text-center">
            <h2 className="text-lg font-semibold">Total Orders</h2>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-yellow-200 p-4 rounded-lg shadow text-center">
            <h2 className="text-lg font-semibold">Pending Orders</h2>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-red-200 p-4 rounded-lg shadow text-center">
            <h2 className="text-lg font-semibold">Cancelled Orders</h2>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Orders</h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3 border-b">Order ID</th>
                <th className="p-3 border-b">Customer</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Total</th>
                <th className="p-3 border-b">Date</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty state for now */}
              <tr>
                <td className="p-3 text-center" colSpan="6">
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
