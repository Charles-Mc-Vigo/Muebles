import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners'; // Import a spinner component

const PasswordResetCreateNew = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`);
      if (!response.ok) {
        throw new Error(response.message);
      }
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Could not fetch user data. Please try again.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setErrorMessage(''); // Clear error message on input change
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
    setErrorMessage(''); // Clear error message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    setIsLoading(true);
    setErrorMessage(''); // Reset error message

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/users/password-reset/new-password/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword, confirmNewPassword }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error('Server error! Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Create a New Password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-sm">
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={handlePasswordChange}
          className={`border border-gray-300 rounded-md p-2 mb-4 w-full ${errorMessage ? 'border-red-500' : ''}`}
          required
          aria-describedby="password-error"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmNewPassword}
          onChange={handleConfirmPasswordChange}
          className={`border border-gray-300 rounded-md p-2 mb-4 w-full ${errorMessage ? 'border-red-500' : ''}`}
          required
          aria-describedby="confirm-password-error"
        />
        {errorMessage && <span id="password-error" className="text-red-500 mb-2">{errorMessage}</span>}
        <button
          type="submit"
          className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? <ClipLoader size={20} color="#fff" /> : 'Create Password'}
        </button>
      </form>
      <ToastContainer aria-live="polite" /> {/* Improved accessibility */}
    </div>
  );
};

export default PasswordResetCreateNew;