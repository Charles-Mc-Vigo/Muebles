import React, { useState, useEffect } from "react";
import { FaSearch, FaTruck, FaShoppingCart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import axios from "axios"; // To make API calls

const DesktopHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // To handle loading state
  const cartItemCount = 0;

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Make an API call to check if the user is logged in
        const response = await axios.get("/api/auth/status", {
          withCredentials: true, // Send cookies (if using cookies for authentication)
        });
        
        if (response.data.loggedIn) {
          setIsLoggedIn(true); // Set the logged-in state if user is authenticated
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false); // Ensure the user is logged out on error
      } finally {
        setLoading(false); // Stop loading once request is complete
      }
    };

    checkLoginStatus(); // Check login status on component mount
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      setIsLoggedIn(false); // Update state to reflect logged out status
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    // Show loading spinner or placeholder while checking login status
    return <div>Loading...</div>;
  }

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
              <FaTruck className="text-gray-600 text-4xl" />
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Shipping Info.
                </p>
                <p className="text-xs text-black">Delivery Method</p>
              </div>
            </Link>
          </div>

          {/* Login / Register or Profile */}
          {!isLoggedIn ? (
            <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <Link to="/login" className="cursor-pointer">
                Login
              </Link>
              <span>|</span>
              <Link to="/signup" className="cursor-pointer">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/userprofile-view" className="flex items-center space-x-2">
                <CgProfile className="text-gray-600 text-4xl cursor-pointer" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-gray-700"
              >
                Logout
              </button>
            </div>
          )}

          {/* Cart Icon */}
          <Link to="/cart" className="relative cursor-pointer">
            <FaShoppingCart className="text-gray-600 text-2xl" />
            {/* Cart item count */}
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full px-1">
                {cartItemCount}
              </span>
            )}
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
        <Link className="text-black py-2 hover:underline m-2" to="/service-page">
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

export default DesktopHeader;
