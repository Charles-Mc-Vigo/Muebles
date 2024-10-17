import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { PiSignOut } from 'react-icons/pi';

const Logout = ({ isAdmin }) => {
  const { adminId } = useParams(); // Get the adminId from the URL params
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState(null); // Store admin details
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch admin details on component load
    const fetchAdminDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/admin/${adminId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch admin details.');
        }

        setAdmin(data); // Set admin data to state
      } catch (err) {
        console.error('Error fetching admin:', err);
        setError('Error fetching admin details. Please try again.');
      }
    };

    fetchAdminDetails();
  }, [adminId]);

  const handleLogout = async () => {
    // Ensure the admin is active before logging out
    if (admin && admin.isActive) {
      const confirmLogout = window.confirm("Are you sure you want to log out?");
      if (confirmLogout) {
        setLoading(true);

        try {
          // Log out the admin and update isActive to false
          const response = await fetch(`http://localhost:3000/api/admin/logout/${adminId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to log out. Please try again.');
          }
          navigate('/admin-login');      // Redirect to the admin login page
        } catch (error) {
          console.error('Error logging out:', error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    } else {
      alert("Admin is not active or couldn't be fetched.");
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
