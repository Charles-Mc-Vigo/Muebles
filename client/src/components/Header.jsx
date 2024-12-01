import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaTruck,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaBoxOpen,
} from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import Notification from "./Notification";

const Header = ({ isLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count from API
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/cart", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch cart data");
  
        const data = await response.json();
        // console.log("API Response:", data); // i-log for debugging hayst
        
        // Check if cart exists and set cartCount using 'count'
        setCartCount(data?.cart?.count || 0);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };
  
    if (isLogin) fetchCartCount();
  }, [isLogin]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsMobileSearchOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className="w-full bg-white shadow-xl rounded-xl">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link
              to="/home"
              className="text-3xl font-bold text-teal-600 whitespace-nowrap"
            >
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
              <Link
                to="/delivery-info"
                className="flex items-center gap-3 hover:text-teal-600 transition-colors"
              >
                <FaTruck className="text-2xl" />
                <div className="hidden xl:block">
                  <p className="text-sm font-semibold">Shipping Info</p>
                  <p className="text-xs">Delivery Method</p>
                </div>
              </Link>
              {isLogin && (
                <Link to="/cart" className="relative">
                  <FaShoppingCart className="text-2xl hover:text-teal-600 transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {isLogin && (
                <div>
                  <Notification/>
                </div>
              )}
              {/* User Icon with Collapsible Menu */}
              <div className="relative">
                {isLogin ? (
                  <>
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center hover:text-teal-600 transition-colors"
                    >
                      <FaUser className="text-2xl" />
                    </button>
                    {/* Collapsible User Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 transition-transform transform opacity-100 text-center">
                        <nav>
                          <Link
                            to="/my-profile/view"
                            className="block py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <CgProfile className="inline-block mr-2 text-2xl" />
                            Manage My Account
                          </Link>
                          <hr className="border-gray-200 py-2" />
                          <Link
                            to="/orders"
                            className="block py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <FaBoxOpen className="inline-block mr-2 text-2xl" />
                            My Order
                          </Link>
                          <hr className="border-gray-200" />
                          <Logout isUser={true} />
                        </nav>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <Link
                      to="/login"
                      className="hover:text-teal-600 transition-colors"
                    >
                      Login
                    </Link>
                    <span>|</span>
                    <Link
                      to="/signup"
                      className="hover:text-teal-600 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
