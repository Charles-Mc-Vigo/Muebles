import React from 'react';
import { FaFacebook, FaInstagram, FaTiktok} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-200 p-10">
      <div className="container  mx-auto grid grid-cols-1 md:grid-cols-5 gap-15">
        {/* Information */}
        <div>
          <h3 className="font-bold mb-4">Information</h3>
          <ul>
            <li><a href="#" className="text-gray-600 hover:text-gray-900">FAQs</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Shipping Information</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Payment Method</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Return Policy</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Terms of Use</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
          </ul>
        </div>

        {/*JCKAME  */}
        <div>
          <h3 className="font-bold mb-4">JCKAME Marinduque</h3>
          <ul>
            <li><a href="#" className="text-gray-600 hover:text-gray-900">About Us</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact Us</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Store Location</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Track Your Parcel</a></li>
          </ul>
        </div>

       

        {/* Useful Links */}
        <div>
          <h3 className="font-bold mb-4">Useful Links</h3>
          <div>
            <p className="text-gray-600 mb-4">Sign-up for our latest happenings now!</p>
            <input type="email" placeholder="Email address" className="p-2 w-full border border-gray-300 rounded mb-4" />
            <button className="bg-teal-500 text-white py-2 px-4 rounded">Sign up</button>
          </div>
          {/* <div className="mt-4">
            <img src="path-to-ps-award-logo.png" alt="PS Award" className="w-full"/>
          </div> */}
        </div>

        {/* Follow us */}
        <div>
          <h3 className="font-bold mb-4">Follow us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900"><FaFacebook size={24} /></a>
            <a href="#" className="text-gray-600 hover:text-gray-900"><FaInstagram size={24} /></a>
            <a href="#" className="text-gray-600 hover:text-gray-900"><FaTiktok size={24} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
