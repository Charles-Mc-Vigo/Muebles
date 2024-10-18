import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiSignOut } from 'react-icons/pi';

const Logout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      setLoading(true);
      try {
        // Make a request to log out on the server-side, including credentials
        const response = await fetch(`http://localhost:3000/api/admin/logout`, {
          method: 'POST',
          credentials: 'include', // Ensure cookies are sent with the request
        });

        if (!response.ok) {
          const data = await response.json(); // Get error message from response
          throw new Error(data.message || 'Failed to log out. Please try again.');
        }

        // Redirect to the admin login page
        navigate('/admin-login');
      } catch (error) {
        console.error('Error logging out:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
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
