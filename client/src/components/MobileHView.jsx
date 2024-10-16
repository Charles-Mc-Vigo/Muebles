import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaTruck,FaShoppingCart } from "react-icons/fa";

const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
  <header className="flex flex-row justify-center space-x-5 items-center p-2 md:hidden ">
  {/* Menu Button */}
  <button onClick={toggleMenu} className="text-2xl">
    {isMenuOpen ? <FaTimes /> : <FaBars />}
  </button>
  
  {/* Logo */}
  <Link to="/" className="text-3xl  font-bold text-teal-600 mx-1">
    MUEBLES
  </Link>
  
  {/* Cart Icon */}
  <Link to="/cart" className="relative cursor-pointer mx-1">
    <FaShoppingCart className="text-gray-600 text-2xl" />
    {/* Cart item count */}
    <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full px-1">
      1
    </span>
  </Link>
</header>

      {/* Search Bar */}
      <div className="flex items-center w-full max-w-xs mx-auto mt-2">
        <input
          type="text"
          placeholder="What are you looking for?"
          className="flex-grow border border-gray-300 px-5 py-1 rounded-l-md focus:outline-none mr-2"
        />
        <button className="bg-teal-600 text-white p-2 px-2 rounded-r-md">
          Search
        </button>
      </div>

      {/* Shipping Info */}
      <div className="flex items-center justify-center p-2 md:hidden">
        <FaTruck className="text-gray-600 text-xl mr-1" />
        <Link to="/delivery-info" className="text-black text-base font-medium">Shipping Info.</Link>
        <p className="text-sm text-black">Delivery Method</p>
      </div>

      {isMenuOpen && (
        <nav className="fixed top-0 left-0 w-64 h-auto bg-white shadow-md z-50 max-h-screen overflow-y-auto m-2">
          <ul className="flex flex-col items-start p-4">
            <div className="flex items-center justify-between w-full text-sm text-black py-2">
              <div className="flex items-start">
                <Link to="/login" onClick={toggleMenu} className="mr-2">Login</Link>
                <span className="mx-1">|</span>
                <Link to="/signup" onClick={toggleMenu} className="ml-2">Register</Link>
              </div>
              <button onClick={toggleMenu} className="text-xl text-gray-600">
                X
              </button>
            </div>
            <Link className="text-black py-2" to="/home" onClick={toggleMenu}>
              All Furnitures
            </Link>
            <Link className="text-black py-2" to="/about" onClick={toggleMenu}>
              About Us
            </Link>
            <Link className="text-black py-2" to="/featured" onClick={toggleMenu}>
              Featured
            </Link>
            <Link className="text-black py-2" to="/service-page" onClick={toggleMenu}>
              Services
            </Link>
          </ul>
        </nav>
      )}
    </>
  );
};

export default MobileHeader;