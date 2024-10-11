import React from "react";
import { FaSearch, FaTruck, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      {/* Main Header */}
      <header className="flex justify-center items-center mx-auto p-2">
        {/* Left - Logo */}
        <div className="flex items-center space-x-5 m-2">
          <Link to="/" className="text-2xl font-bold text-teal-600">
            MUEBLES
          </Link>
        </div>
        {/* Middle - Search Bar */}
        <div className="flex items-center w-full max-w-2xl m-2">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="flex-grow border border-gray-300 px-4 py-2 focus:outline-none"
          />
          <button className="bg-teal-600 text-white p-3">
            <FaSearch />
          </button>
        </div>
        {/* Right - Info, Login/Register, Cart */}
        <div className="flex items-center space-x-10 m-2">
          <div className="flex items-center space-x-2 cursor-pointer">
            <Link to="/delivery-info" className="flex items-center space-x-2">
              {" "}
              {/* Wrap with Link */}
              <FaTruck className="text-gray-600 text-5xl" />
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Shipping Info.
                </p>
                <p className="text-xs text-black">Delivery Method</p>
              </div>
            </Link>
          </div>
          {/* Login / Register */}
          <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
            <Link to="/login" className="cursor-pointer">
              Login
            </Link>
            <span>|</span>
            <Link to="/signup" className="cursor-pointer">
              Register
            </Link>
          </div>
          {/* Cart Icon */}
          <Link to="/cart" className="relative cursor-pointer">
            <FaShoppingCart className="text-gray-600 text-2xl" />
            {/* Cart item count */}
            <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full px-1">
              1
            </span>
          </Link>
        </div>
      </header>
      {/* Second Navigation Bar */}
      <nav className="flex justify-center space-x-8 py-0 bg-white text-lg">
        <Link className="text-black py-2 hover:underline m-2" to="/home">
          All Furnitures
        </Link>
        <Link className="text-black py-2 hover:underline m-2" to="/about">
          About Us
        </Link>
        <Link className="text-black py-2 hover:underline m-2" to="/featured">
          Featured
        </Link>
        <Link
          className="text-black py-2 hover:underline m-2"
          to="/service-page"
        >
          Services
        </Link>
        <div className="flex items-center space-x-2 text-sm text-black py-2 m-2">
          <span className="text-teal-500">•</span>
          <Link to="/brochure" className="text-teal-500 hover:underline">
            Brochure
          </Link>
          <span className="text-gray-400">•</span>
          <Link to="/store-location" className="text-gray-700 hover:underline">
            Store Location
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Header;
