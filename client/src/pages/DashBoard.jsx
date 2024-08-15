import React from 'react';
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';


const DashBoard = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('adminToken');
    navigate('/admin')
    console.log('Logging out...');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold">Admin Dashboard</div>
        <ul className="flex-1">
          <li className="p-4 hover:bg-gray-700">
            <a href="#user-management">User Management</a>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <a href="#order-management">Order Management</a>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <a href="#product-management">Furniture Product Management</a>
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
        {/* User Management Section */}
        <section id="user-management" className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">User Management</h2>
          <div className="bg-white p-4 rounded shadow">
            {/* User management content */}
            <p>Manage users here.</p>
          </div>
        </section>

        {/* Order Management Section */}
        <section id="order-management" className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Order Management</h2>
          <div className="bg-white p-4 rounded shadow">
            {/* Order management content */}
            <p>Manage orders here.</p>
          </div>
        </section>

        {/* Product Management Section */}
        <section id="product-management">
          <h2 className="text-2xl font-semibold mb-4">Furniture Product Management</h2>
          <div className="bg-white p-4 rounded shadow">
            {/* Product management content */}
            <p>Manage products here.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashBoard;
