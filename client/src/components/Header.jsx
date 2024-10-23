import React, { useState, useEffect } from "react";
import { FaSearch, FaTruck, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logout from "./Logout";

const Header = ({ isLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsMobileSearchOpen(false);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  return (
    <header className="relative w-full bg-white shadow-md">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-teal-600 whitespace-nowrap">
              MUEBLES
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="flex">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-full border border-gray-300 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button className="bg-teal-600 text-white px-6 py-2 rounded-r-md hover:bg-teal-700 transition-colors">
                  <FaSearch className="text-lg" />
                </button>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center gap-8">
              <Link to="/delivery-info" className="flex items-center gap-3 hover:text-teal-600 transition-colors">
                <FaTruck className="text-2xl" />
                <div className="hidden xl:block">
                  <p className="text-sm font-semibold">Shipping Info</p>
                  <p className="text-xs">Delivery Method</p>
                </div>
              </Link>

              <div className="flex items-center gap-4">
                {isLogin ? (
                  <Logout isUser={true} />
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <Link to="/login" className="hover:text-teal-600 transition-colors">Login</Link>
                    <span>|</span>
                    <Link to="/signup" className="hover:text-teal-600 transition-colors">Sign Up</Link>
                  </div>
                )}
              </div>

              {isLogin && (
                <Link to="/cart" className="relative">
                  <FaShoppingCart className="text-2xl hover:text-teal-600 transition-colors" />
                  <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
     
      </div>
       {/* Second Navigation Bar */}
      <nav className="hidden md:flex justify-center space-x-8 py-0 bg-white text-lg">
        
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
            <Link
              to="/store-location"
              className="text-gray-700 hover:underline"
            >
              Store Location
            </Link>
          </div>
        </nav>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={toggleMenu}
              className="menu-button p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              <FaBars className="text-xl" />
            </button>

            <Link to="/" className="text-2xl font-bold text-teal-600">
              MUEBLES
            </Link>

            <div className="flex items-center gap-4">
              <button 
                onClick={toggleMobileSearch}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Toggle search"
              >
                <FaSearch className="text-xl" />
              </button>

              {isLogin && (
                <Link to="/cart" className="relative">
                  <FaShoppingCart className="text-xl" />
                  <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isMobileSearchOpen && (
            <div className="mt-3">
              <div className="flex">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-full border border-gray-300 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button className="bg-teal-600 text-white px-6 py-2 rounded-r-md">
                  <FaSearch />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
            <div className="mobile-menu fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50 overflow-y-auto">
              <div className="p-4">
                <div className="flex justify-end">
                  <button 
                    onClick={toggleMenu}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    aria-label="Close menu"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                <div className="mt-4">
                  {isLogin ? (
                    <Logout isUser={true} />
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Link 
                        to="/login" 
                        className="block px-4 py-2 text-center rounded-md bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                        onClick={toggleMenu}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/signup" 
                        className="block px-4 py-2 text-center rounded-md border border-teal-600 text-teal-600 hover:bg-teal-50 transition-colors"
                        onClick={toggleMenu}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>

                <nav className="mt-6">
                  <div className="space-y-4">
                    <Link 
                      to="/delivery-info" 
                      className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                      onClick={toggleMenu}
                    >
                      <FaTruck className="text-xl" />
                      <span>Shipping Info</span>
                    </Link>
                    <Link 
                      to="/home" 
                      className="block px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                      onClick={toggleMenu}
                    >
                      All Furnitures
                    </Link>
                    <Link 
                      to="/about" 
                      className="block px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                      onClick={toggleMenu}
                    >
                      About Us
                    </Link>
                    <Link 
                      to="/featured" 
                      className="block px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                      onClick={toggleMenu}
                    >
                      Featured
                    </Link>
                    <Link 
                      to="/service-page" 
                      className="block px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                      onClick={toggleMenu}
                    >
                      Services
                    </Link>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;