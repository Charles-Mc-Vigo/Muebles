import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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


const Header = ({ isLogin, cartCount, }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        !event.target.closest(".mobile-menu") &&
        !event.target.closest(".menu-button")
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

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
  //search
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent form submission
    
    if (searchQuery.trim()) {
      try {
        const response = await fetch(`http://localhost:3000/api/search?query=${searchQuery}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("API Response Data:", data); // Debug log to verify the API response
  
        // Ensure the data is passed correctly to the /search-results page
        if (data.length > 0) {
          console.log("Passing data to search results:", data); // Log the data before navigation
          navigate("/search-result", { state: { searchResults: data } });
        } else {
          console.log("No results found. Passing empty array.");
          navigate("/search-result", { state: { searchResults: [] } });
        }
  
      } catch (error) {
        console.error("Error while searching:", error);
        navigate("/search-result", { state: { searchResults: [] } }); // Pass empty array in case of error
      }
    }
  };
  

  return (
    <header className=" w-full bg-white shadow-xl rounded-xl ">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link
              to="/"
              className="text-3xl font-bold text-teal-600 whitespace-nowrap"
            >
              MUEBLES
            </Link>
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          placeholder="What are you looking for?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          className="bg-teal-600 text-white px-6 py-2 rounded-r-md hover:bg-teal-700 transition-colors"
        >
          <FaSearch className="text-lg" />
        </button>
      </form>
    </div>    
            {/* Search Results */}
              <div className="search-result">
                {searchResults.map((result) => (
                  <div key={result._id} className="search-result-item">
                    {/* Render your result details here */}
                    <h3>{result.name}</h3>
                    <p>{result.description}</p>
                    {/* Add any other fields you want to display */}
                  </div>
                ))}
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
      {/* Second Navigation Bar */}
      <nav className="hidden md:flex justify-center space-x-8 py-0  text-lg ">
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
          <span className="text-teal-500 text-base font-bold">•</span>
          <Link
            to="https://tinyurl.com/5avjxzav"
            target="blank"
            rel="noopener noreferrer"
            className="text-gray-700 text-base hover:underline"
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
                  <FaShoppingCart className="text-2xl hover:text-teal-600 transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
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
          <div className="fixed inset-0 bg-transparent   bg-opacity-50 z-40">
            <div className="mobile-menu fixed inset-y-0 left-0 w-64 bg-gray-100 shadow-xl border border-teal-500 rounded-br-xl rounded-tr-xl z-50 overflow-y-auto">
              <div className="p-2  m-2">
                <div className="flex justify-start text-teal-400  ">
                  <button
                    onClick={toggleMenu}
                    className="p-2  hover:text-teal-700 rounded-md transition-colors"
                    aria-label="Close menu"
                  >
                    <FaTimes className="text-3xl" />
                  </button>
                </div>
                <div className="inset-0  flex ">
                  {isLogin ? (
                    <div className="flex flex-col  py-3 px-2 font-serif gap-5 items-baseline">
                      <Link
                        to="/my-profile/view"
                        className="flex items-center font-normal p-1 gap-2 rounded-md text-base tex-black hover:bg-teal-600 transition-colors"
                        onClick={toggleMenu}
                      >
                        <CgProfile className="inline-block text-teal-600 text-4xl hover:text-teal-600" />
                        Manage Account
                      </Link>
                      <Link
                        to="/cart"
                        className="block py-2 p-1 text-center rounded-md text-black text-normal text-lg hover:bg-teal-700 transition-colors"
                      >
                        <div className="flex items-center gap-2 font-normal text-xl  justify-center">
                          <FaShoppingCart className="text-teal-600 text-4xl" />
                          <span>Cart</span>
                        </div>
                      </Link>

                      <Link
                        className="text-black  font-normal text-lg hover:text-teal-500"
                        to="/home"
                      >
                        All Furnitures
                      </Link>
                      <Link
                        className="text-black  font-normal text-lg hover:text-teal-500"
                        to="/about"
                      >
                        About Us
                      </Link>
                      <Link
                        className="text-black  font-normal text-lg hover:text-teal-500 "
                        to="/featured"
                      >
                        Featured
                      </Link>
                      <Link
                        className="text-black  font-normal text-lg hover:text-teal-500"
                        to="/service-page"
                      >
                        Services
                      </Link>
                      <div className="flex items-center gap-1  text-black py-2 ">
                        <span className="text-teal-500  text-lg font-bold">
                          •
                        </span>
                        <Link
                          to="https://tinyurl.com/5avjxzav"
                          target="blank"
                          rel="noopener noreferrer"
                          className="text-black font-normal text-base hover:text-teal-500"
                        >
                          Store Location
                        </Link>
                      </div>
                      <Logout isUser={true} className="inline-block  " />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-center rounded-md text-black hover:bg-teal-700 transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-center rounded-md text-black hover:bg-teal-700 transition-colors"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;