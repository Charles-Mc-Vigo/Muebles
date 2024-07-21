import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Header({ showLogin = false, category = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-slate-100">
      <div className="flex flex-wrap justify-between items-center max-w-7xl mx-auto p-5">
        <div>
          <Link to="/">
            <h1 className="font-bold">JCKAME</h1>
          </Link>
        </div>
        <button
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars />
        </button>
        <div
          className={`w-full lg:w-auto ${
            isMenuOpen ? "block" : "hidden"
          } lg:block text-right`}
        >
          <ul className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 mt-4 lg:mt-0">
            {category ? (
              <li className="relative hover:opacity-60 cursor-pointer text-center">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center justify-center lg:justify-start w-full"
                >
                  Category {isDropdownOpen ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                </button>
                {isDropdownOpen && (
                  <ul className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                    <Link to="/category1">
                      <li className="px-4 py-2 hover:bg-gray-100">
                        Category 1
                      </li>
                    </Link>
                    <Link to="/category2">
                      <li className="px-4 py-2 hover:bg-gray-100">
                        Category 2
                      </li>
                    </Link>
                    <Link to="/category3">
                      <li className="px-4 py-2 hover:bg-gray-100">
                        Category 3
                      </li>
                    </Link>
                  </ul>
                )}
              </li>
            ) : (
              <li className="hover:opacity-60">
                <Link to="/shop">Shop Now!</Link>
              </li>
            )}
            <li className="hover:opacity-60">
              <Link to="/about">About Us</Link>
            </li>
            <li className="hover:opacity-60">
              <Link to="/featured">Featured</Link>
            </li>
            <li className="hover:opacity-60">
              <Link to="/services">Services</Link>
            </li>
            <li className="hover:opacity-60">
              <Link to="/testimony">Testimony</Link>
            </li>
          </ul>
        </div>
        <div
          className={`w-full lg:w-auto ${
            isMenuOpen ? "block" : "hidden"
          } lg:block text-right`}
        >
          <ul className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-4">
            {showLogin ? (
              <li>
                <Link to="/login">
                  <button className="flex items-center rounded-md py-2 px-8 bg-slate-700 text-white hover:opacity-60">
                    Log In
                  </button>
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/cart">
                  <FaShoppingCart className="text-4xl lg:text-3xl text-gray-600 cursor-pointer" />
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}