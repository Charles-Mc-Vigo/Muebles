import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { FaFacebook, FaInstagram } from "react-icons/fa"; 

const Footer = () => {
  return (
    <footer className="bg-white text-black font-serif border-t border-b border-green-700">
      <div className="flex flex-col md:flex-row justify-between items-center p-2 ml-2">
        
        <div className="md:w-2/3 flex flex-col items-start">
          <h2 className="text-4xl font-bold font-sans mb-2">
            Stay Updated with JCKAME’s
          </h2>
          <p className="mb-4 font-sans text-2xl">
            Get the latest updates and promotion from JCKAME delivered
            straight to your inbox.
          </p>
          <div className="flex space-x-3 border-green-700">
            <input
              type="email"
              placeholder="Enter your email Address"
              className="border rounded-md p-2"
            />
            <button className="bg-white text-black px-4 py-2 rounded-md border-2 border-green-700">
              Subscribe
            </button>
          </div>
        </div>

        <div className="md:w-1/3 flex flex-col items-center mt-6 md:mt-0">
          <div className="mb-0.5 mt-0.5 border-4 border-green-700 rounded-full object-contain">
            <img
              src="/landingimage/LOGO.jpg"
              alt="JCKAME Logo"
              className="w-50 h-20 rounded-full"
            />
          </div>
          <div>
            <p className="text-lg font-sans font-semibold flex items-center">
              <FaMapMarkerAlt className="mr-2" /> Cawit-Tugos Barangay Rd, Boac, Marinduque
            </p>
            <p className="text-lg font-sans font-semibold flex items-center">
              <FaPhoneAlt className="mr-2" /> 0945 270 3377
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-500">
              <FaFacebook size={28} />
            </a>
            <a href="#" className="hover:text-pink-500">
              <FaInstagram size={28} />
            </a>
          </div>
        </div>
      </div>

      {/* Centered Policy Links and Copyright */}
      <div className="border-b border-green-700 text-center">
        <div className="flex flex-row justify-center items-center space-x-2 text-sm">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Use</a>
          <a href="#" className="hover:underline">Sales and Refunds</a>
          <a href="#" className="hover:underline">Legal</a>
        </div>
        <p className="text-center text-sm mt-2">© 2024 JCKAME. All rights reserved.</p>
      </div>

    </footer>
  );
};

export default Footer;
