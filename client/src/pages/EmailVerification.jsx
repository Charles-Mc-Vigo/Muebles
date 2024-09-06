import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
  
const EmailVerification = () => {
  const [email, setEmail] = useState(''); // Initialize with an empty string
  const [code, setCode] = useState('');

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCodeChange = (e) => {
    const codeValue = e.target.value;
    // Ensure the code is 6 digits and numeric
    if (codeValue.length <= 6 && /^[0-9]*$/.test(codeValue)) {
      setCode(codeValue); // Corrected setCode
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/verify-email",
        {
          email,
          code
        },
        {
          headers: {
            'Content-Type': 'application/json', // Change this to 'application/json'
          },
        }
      );
      console.log('Response:', response.data);
  
      if (response.data.token) {
        Cookies.set('authToken', response.data.token, {
          expires: 3, // Token expiration in days
          secure: process.env.NODE_ENV === 'production' // Use HTTPS in production
        });
  
        alert('Account verified successfully!');
        navigate('/home');
      } else {
        alert('Account verification unsuccessful!');
      }
    } catch (error) {
      console.error('Error verifying email:', error);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Email Verification</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Verification Code</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={handleCodeChange}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter 6-digit code"
              maxLength="6"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;
