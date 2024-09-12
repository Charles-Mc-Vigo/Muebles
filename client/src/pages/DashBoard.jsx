import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faListUl, faUser, faBell, faHandshake } from '@fortawesome/free-solid-svg-icons'; 
import { useNavigate } from 'react-router-dom';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';



const DashBoard = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [transactionDropdownOpen, setTransactionDropdownOpen] = useState(false);
  const [DeliveryDropdownOpen, setDeliveryDropdownOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove('adminToken');
    navigate('/admin-login');
    console.log('Logging out...');
  };

  const navigateToSection = (section) => {
    navigate(`/${section}`);
  };

  const handleImageClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleProductDropdown = () => {
    setProductDropdownOpen(!productDropdownOpen);
  };

  const toggleTransactionDropdown = () => {
    setTransactionDropdownOpen(!transactionDropdownOpen);
  };
  const toggleDeliveryDropdown =() => {
    setDeliveryDropdownOpen(!DeliveryDropdownOpen);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <nav className="w-64 bg-white text-black flex flex-col justify-between border-r-2 border-green-300 h-screen">
        <div>
          <div className="p-6 text-xl font-bold text-center border-b-2 border-green-300">
            Admin Dashboard
          </div>
          <ul>
            {/* Product Management with Dropdown */}
            <li className="flex flex-col cursor-pointer transition-colors border-green-300">
              <div className="flex items-center justify-between hover:bg-green-300 border-b-2 border-green-300 p-3" onClick={toggleProductDropdown}>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faBox} className="w-6 h-6 ml-2 mt-2" />
                  <span className="ml-3">Product Management</span>
                </div>
                <FontAwesomeIcon icon={productDropdownOpen ? faChevronUp : faChevronDown} className="w-4 h-4" />
              </div>
              {productDropdownOpen && (
                <ul className="">
                  <li className="p-3 border-b-2 border-green-300 hover:bg-green-300 cursor-pointer" onClick={() => navigateToSection('product-management')}>Add Product</li>
                  <li className="p-3 border-b-2 border-green-300 hover:bg-green-300 cursor-pointer" onClick={() => navigateToSection('remove-product')}>Remove Product</li>
                  <li className="p-3 border-b-2 border-green-300 hover:bg-green-300 cursor-pointer" onClick={() => navigateToSection('view-product-list')}>View Product List</li>
                </ul>
              )}
            </li>


            {/* Order Management */}
            <li
              className="p-4 flex items-center hover:bg-green-300 cursor-pointer transition-colors border-b-2 border-green-300"
              onClick={() => navigateToSection('order-management')}
            >
              <FontAwesomeIcon icon={faListUl} className="w-6 h-6 mr-3" />
              Order Management
            </li>

            {/* Customers */}
            <li
              className="p-4 flex items-center hover:bg-green-300 cursor-pointer transition-colors border-b-2 border-green-300"
              onClick={() => navigateToSection('user-management')}
            >
              <FontAwesomeIcon icon={faUser} className="w-6 h-6 mr-3" />
              Customers
            </li>

            {/* Transactions with Dropdown */}
            <li className="flex flex-col cursor-pointer transition-colors border-green-300">
              <div className="flex items-center justify-between hover:bg-green-300 p-3 border-b-2 border-green-300" onClick={toggleTransactionDropdown}>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faHandshake} className="w-6 h-6 mr-3" />
                  Transactions
                </div>
                <FontAwesomeIcon icon={transactionDropdownOpen ? faChevronUp : faChevronDown} className="w-4 h-4" />
              </div>
              {transactionDropdownOpen && (
                <ul className="">
                  <li className="p-3 border-b-2 border-green-300 hover:bg-green-300 cursor-pointer" onClick={() => navigateToSection('customer-payment')}>Customer Payment</li>
                  <li className="p-3 border-b-2 border-green-300 hover:bg-green-300 cursor-pointer" onClick={() => navigateToSection('completed-transactions')}>Completed Transactions</li>
                </ul>
              )}
            </li>


            {/* Delivery */}
              <li className="flex flex-col cursor-pointer transition-colors border-green-300">
                <div className="flex items-center justify-between hover:bg-green-300 p-3 border-b-2 border-green-300" onClick={toggleDeliveryDropdown}>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faTruck} className="w-6 h-6 mr-3" />
                    Delivery Status
                  </div>
                  <FontAwesomeIcon icon={DeliveryDropdownOpen ? faChevronUp : faChevronDown} className="w-4 h-4" />
                </div>
                {DeliveryDropdownOpen && (
                  <ul className="">
                    <li className="p-3 border-b-2 border-green-300 hover:bg-green-300 cursor-pointer" onClick={() => navigateToSection('customer-payment')}>Processing</li>
                    <li className="p-3 border-b-2 border-green-300 hover:bg-green-300 cursor-pointer" onClick={() => navigateToSection('completed-transactions')}>Shipped</li>
                    <li className="p-3 border-b-2 border-green-300 hover:bg-green-300 cursor-pointer" onClick={() => navigateToSection('completed-transactions')}>Delivered</li>
                  </ul>
                )}
              </li>

          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="bg-white text-black p-4 hover:bg-green-300 w-full transition-colors border-t-2 border-green-300"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Admin profile and notification */}
        <section className="flex items-center justify-between bg-white border-b-2 border-green-300 mb-10" style={{ height: '8.5vh' }}>
          <div className='flex-1 flex items-center justify-center'>
            <h1 className='text-4xl font-sans gap-5 font-bold'>JCKAME</h1>
          </div>
          <button className="relative p-2 text-gray-600 hover:text-gray-900 m-20">
            <FontAwesomeIcon icon={faBell} className="w-6 h-6" />
            {/* Notification badge */}
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">3</span>
          </button>

          <div className="relative flex items-center">
            <img
              className="h-16 w-16 border-2 object-contain cursor-pointer ml-5 mr-10 rounded-full"
              src="/landingimage/LOGO.jpg"
              alt="adminprofile"
              onClick={handleImageClick}
            />
            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 mr-2 w-48 bg-white border border-gray-300 shadow-lg rounded-lg">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Admin 1</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Admin 2</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Admin 3</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Dashboard Overview */}
        <section className="flex-1 flex items-center justify-center">
          <div className="bg-gray-100 p-8 rounded-lg shadow-md h-full w-full mr-10 ml-10 mb-10 text-center">
            <h1 className="text-3xl font-bold mb-8 text-center">Dashboard Overview</h1>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white border-2 border-green-300 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                  <h2 className="text-2xl font-semibold mb-2 text-black">Today's Orders</h2>
                  <p className="text-3xl font-bold text-black">0</p>
                </div>
                <div className="bg-white border-2 border-green-300  p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                  <h2 className="text-2xl font-semibold mb-2  text-black">Total Orders</h2>
                  <p className="text-3xl font-bold text-black">0</p>
                </div>
                <div className="bg-white border-2 border-green-300 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                  <h2 className="text-2xl font-semibold mb-2  text-black">Pending Orders</h2>
                  <p className="text-3xl font-bold text-black">0</p>
                </div>
                <div className="bg-white border-2 border-green-300  p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                  <h2 className="text-2xl font-semibold mb-2  text-black">Cancelled Orders</h2>
                  <p className="text-3xl font-bold text-black">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border-green-300 border-2 shadow-lg p-1">
              <h2 className="text-xl font-bold mb-3 text-black mt-3">Recent Orders</h2>
              <table className="w-full table-auto border-collapse text-left ">
                <thead>
                  <tr className="bg-green-500 text-black ">
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
                    <td className="p-3 text-center text-black" colSpan="6">
                      No orders available.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashBoard;
