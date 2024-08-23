import React, { useState } from "react";
import { FaBars, FaShoppingCart, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { RiCustomerServiceFill } from "react-icons/ri";


export default function Header({ showLogin = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHomeFurnitureDropdownOpen, setIsHomeFurnitureDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleHomeFurnitureDropdown = () => {
    setIsHomeFurnitureDropdownOpen(!isHomeFurnitureDropdownOpen);
  };

  return (
    <div className="bg-slate-100 border border-green-500 border-solid b-2 md:border-solid">
      <div className="relative flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto p-5">
        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center justify-between w-full">
          <button onClick={toggleMenu}>
            <FaBars />
          </button>
          <div className="flex-1 text-center">
            <Link to="/">
              <h1 className="font-semibold font-serif text-2xl text-black">JCKAME</h1>
            </Link>
          </div>
          <Link to="/cart" className="lg:hidden">
            <FaShoppingCart className="text-3xl cursor-pointer hover:bg-green-300" />
          </Link>
        </div>

        {/* Desktop Logo */}
        <div className="hidden lg:flex items-center justify-start flex-1">
          <Link to="/">
            <h1 className="font-semibold font-serif text-2xl text-black">JCKAME</h1>
          </Link>
        </div>

        {/* Centered Menu Items */}
        <div className="hidden lg:flex justify-center flex-1 space-x-8 font-sans">
          <ul className="flex items-center space-x-4">
            <li className="relative hover:opacity-100 cursor-pointer">
              <button
                onClick={toggleHomeFurnitureDropdown}
                className="flex items-center"
              >
                Home Furniture {isHomeFurnitureDropdownOpen ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
              </button>
              {isHomeFurnitureDropdownOpen && (
                <ul className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 font-sans">
                  <Link to="/Furniture-list">
                    <li className="px-4 py-2 hover:bg-gray-100">All Furnitures </li>
                  </Link>
                  <Link to="/livingroom">
                    <li className="px-4 py-2 hover:bg-gray-100">Living Room</li>
                  </Link>
                  <Link to="/bedroom">
                    <li className="px-4 py-2 hover:bg-gray-100">Bedroom</li>
                  </Link>
                  <Link to="/diningroom">
                    <li className="px-4 py-2 hover:bg-gray-100">Dining Room</li>
                  </Link>
                  
                </ul>
              )}
            </li>
            <Link to="/aboutus" className="hover:text-gray-400">About Us</Link>
            <Link to="/featured" className="hover:text-gray-400">Featured</Link>
            <Link to="/services" className="hover:text-gray-400">Services</Link>
          </ul>
        </div>

        {/* Right Side: Cart, Log In, Customer Service */}
        <div className="hidden lg:flex items-center space-x-6 ml-10">
          <Link to="/customer-service" className="flex items-center hover:text-gray-400">
            <RiCustomerServiceFill className="mr-2 text-2xl lg:text-1xl" />
            Customer Service
          </Link>
          <Link to="/cart">
            <FaShoppingCart className="text-2xl cursor-pointer hover:bg-green-300" />
          </Link>
          {showLogin ? (
            <Link to="/login">
              <button className="rounded-md py-2 px-4 bg-transparent text-black text-lg font-semibold hover:bg-green-300">
                Log In
              </button>
            </Link>
          ) : null}
        </div>

        {/* Mobile Menu Items */}
        <div
          className={`absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 ${isMenuOpen ? "block" : "hidden"} lg:hidden`}
        >
          <ul className="flex flex-col space-y-2 mt-4">
            <li className="relative hover:opacity-100 cursor-pointer text-left">
              <button
                onClick={toggleHomeFurnitureDropdown}
                className="flex items-center justify-start w-full"
              >
                Home Furniture {isHomeFurnitureDropdownOpen ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
              </button>
              {isHomeFurnitureDropdownOpen && (
                <ul className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 ">
                  <Link to="/livingroom">
                    <li className="px-4 py-2 hover:bg-gray-100">Living Room</li>
                  </Link>
                  <Link to="/bedroom">
                    <li className="px-4 py-2 hover:bg-gray-100">Bedroom</li>
                  </Link>
                  <Link to="/diningroom">
                    <li className="px-4 py-2 hover:bg-gray-100">Dining Room</li>
                  </Link>
                  
                </ul>
              )}
            </li>
            <Link to="/aboutus" className="hover:text-gray-400 ml-2">About Us</Link>
            <Link to="/featured" className="hover:text-gray-400 ml-2">Featured</Link>
            <Link to="/services" className="hover:text-gray-400 ml-2">Services</Link>
            <Link to="/customer-service" className="hover:text-gray-400 flex items-center">
              <RiCustomerServiceFill className="mr-2 ml-2" />
              Customer Service
            </Link>
            {showLogin ? (
              <Link to="/login">
                <button className="flex items-center rounded-md py-2 px-8 bg-transparent text-black bg-slate-300 text-lg font-semibold hover:bg-green-300 ">
                  Log In
                </button>
              </Link>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
}
