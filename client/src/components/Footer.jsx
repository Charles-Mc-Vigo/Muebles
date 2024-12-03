import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";


const Footer = () => {
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);

  const togglePhoneNumber = () => {
    setShowPhoneNumber((prev) => !prev);
  };
  return (
    <footer className="bg-gray-200 p-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-15">
        {/* Information */}
        <div>
          <h3 className="font-bold mb-4">Information</h3>
          <ul>
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                FAQs
              </a>
            </li>
            <li>
              <a href="/delivery-info" className="text-gray-600 hover:text-gray-900">
                Shipping Information
              </a>
            </li>
            <li>
              <a href="/payment-method" className="text-gray-600 hover:text-gray-900">
                Payment Method
              </a>
            </li>
            <li>
              <a href="terms&condition" className="text-gray-600 hover:text-gray-900">
                Terms of Use
              </a>
            </li>
            <li>
              <a href="terms&condition" className="text-gray-600 hover:text-gray-900">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/service-page" className="text-gray-600 hover:text-gray-900">
                Services
              </a>
            </li>
          </ul>
        </div>

        {/*JCKAME  */}
        <div>
          <h3 className="font-bold mb-4">JCKAME Marinduque</h3>
          <ul>
            <li>
              <a href="about" className="text-gray-600 hover:text-gray-900">
                About Us
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900"
                onClick={togglePhoneNumber}
              >
                Contact Us
              </a>
              {showPhoneNumber && (
                <div className="mt-2 text-gray-800">
                  Phone: (+63) 1234567890
                </div>
              )}
            </li>
            <li>
              <a href="https://tinyurl.com/5avjxzav"
              target="blank"
              rel="noopener noreferrer"
               className="text-gray-600 hover:text-gray-900">
                Store Location
              </a>
            </li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="font-bold mb-4">Useful Links</h3>
          <div>
            <p className="text-gray-600 mb-4">
              Sign-up for our latest happenings now!
            </p>
            <input
              type="email"
              placeholder="jckamewoodworks@gmail.com"
              className="p-2 w-full border border-gray-300 rounded mb-4"
            />
            <Link to="#" onClick={()=>alert("Unavailable for now hihiih")} className="bg-green-500 text-white py-2 px-4 rounded inline-block"
            >
              Subscribe
            </Link>
          </div>
        </div>

        {/* Follow us */}
        <div>
          <h3 className="font-bold mb-4">Follow us</h3>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/ItsmeJeyC"
              target="blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-green-600">
              <FaFacebook size={24} />
            </a>
            <a href="https://www.instagram.com/jckame_woodworks/"
              target="blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-green-600">
              <FaInstagram size={24} />
            </a>
            <a href="#" className="text-gray-600 hover:text-green-600">
              <FaTiktok size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
