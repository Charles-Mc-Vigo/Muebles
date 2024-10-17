import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { PiSignOut } from 'react-icons/pi';

const Logout = ({ isAdmin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      setLoading(true);
      // Simulate a delay for better UX if needed
      setTimeout(() => {
        // Remove token based on the isAdmin prop
        if (isAdmin) {
          Cookies.remove('adminToken');
          navigate('/admin-login');
        } else {
          Cookies.remove('authToken');
          navigate('/login');
        }
      }, 500);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2 px-4 w-10/12 mt-auto rounded-lg shadow-md hover:bg-red-700 transition duration-200 ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <PiSignOut className="text-xl" />
      <span>{loading ? 'Logging out...' : 'Sign Out'}</span>
    </button>
  );
};

export default Logout;
