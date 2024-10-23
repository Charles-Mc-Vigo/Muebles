import React, { useState } from "react";
import { FaSearch, FaTruck, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logout from "./Logout";

const Header = ({ isLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Header for Desktop */}
      <div className="hidden md:flex justify-between items-center p-4 bg-white shadow-md">
        {/* Left - Logo */}
        <Link to="/" className="text-2xl font-bold text-teal-600">
          MUEBLES
        </Link>
        {/* Middle - Search Bar */}
        <div className="flex items-center w-full max-w-2xl mx-4">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="flex-grow border border-gray-300 px-4 py-2 focus:outline-none rounded-l-md"
          />
          <button className="bg-teal-600 text-white p-3 rounded-r-md">
            <FaSearch />
          </button>
        </div>
        {/* Right - Info, Login/Register or Logout, Cart */}
        <div className="flex items-center space-x-10">
          <Link to="/delivery-info" className="flex items-center space-x-2">
            <FaTruck className="text-gray-600 text-5xl" />
            <div>
              <p className="text-sm font-semibold text-gray-700">Shipping Info.</p>
              <p className="text-xs text-black">Delivery Method</p>
            </div>
          </Link>
          {/* Login / Register or Logout */}
          <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
            {isLogin ? (
              <Logout isUser={true} />
            ) : (
              <>
                <Link to="/login" className="cursor-pointer">Login</Link>
                <span>|</span>
                <Link to="/signup" className="cursor-pointer">Sign Up</Link>
              </>
            )}
          </div>
          {/* Cart Icon (only if logged in) */}
          {isLogin && (
            <Link to="/cart" className="relative cursor-pointer">
              <FaShoppingCart className="text-gray-600 text-2xl" />
              <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full px-1">0</span>
            </Link>
          )}
        </div>
      </div>

      {/* Header for Mobile */}
      <header className="flex flex-col md:hidden p-4 bg-white shadow-md">
        {/* Menu Button */}
        <div className="flex justify-between items-center">
          <button onClick={toggleMenu} className="text-2xl">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <Link to="/" className="text-3xl font-bold text-teal-600">MUEBLES</Link>
          {isLogin && (
            <Link to="/cart" className="relative cursor-pointer mx-1">
              <FaShoppingCart className="text-gray-600 text-2xl" />
              <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full px-1">1</span>
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex items-center w-full max-w-xs mx-auto mt-2">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="flex-grow border border-gray-300 px-5 py-1 rounded-l-md focus:outline-none mr-2"
          />
          <button className="bg-teal-600 text-white p-2 px-2 rounded-r-md">Search</button>
        </div>

        {/* Shipping Info */}
        <div className="flex items-center justify-center p-2">
          <FaTruck className="text-gray-600 text-xl mr-1" />
          <Link to="/delivery-info" className="text-black text-base font-medium">Shipping Info.</Link>
          <p className="text-sm text-black">Delivery Method</p>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="fixed top-0 left-0 w-64 h-auto bg-white shadow-md z-50 max-h-screen overflow-y-auto m-2">
            <ul className="flex flex-col items-start p-4">
              <div className="flex items-center justify-between w-full text-sm text-black py-2">
                <div className="flex items-start">
                  {isLogin ? (
                    <Link to="/logout" onClick={toggleMenu} className="mr-2">Logout</Link>
                  ) : (
                    <>
                      <Link to="/login" onClick={toggleMenu} className="mr-2">Login</Link>
                      <span className="mx-1">|</span>
                      <Link to="/signup" onClick={toggleMenu} className="ml-2">Sign Up</Link>
                    </>
                  )}
                </div>
                <button onClick={toggleMenu} className="text-xl text-gray-600">X</button>
              </div>
              <Link className="text-black py-2" to="/home" onClick={toggleMenu}>All Furnitures</Link>
              <Link className="text-black py-2" to="/about" onClick={toggleMenu}>About Us</Link>
              <Link className="text-black py-2" to="/featured" onClick={toggleMenu}>Featured</Link>
              <Link className="text-black py-2" to="/service-page" onClick={toggleMenu}>Services</Link>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
