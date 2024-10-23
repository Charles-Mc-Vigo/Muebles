import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners'; // Import a spinner component

const PasswordResetVerify = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [code, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate();

  const handleCodeChange = (e) => {
    setVerificationCode(e.target.value);
    setErrorMessage(''); // Clear error message on input change
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`);
      if (!response.ok) {
        throw new Error("User not found");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    setIsLoading(true);
    setErrorMessage(''); // Reset error message

    try {
      const response = await fetch(`http://localhost:3000/api/users/password-reset/verify/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setTimeout(() => {
          navigate(`/password-reset/new-password/${userId}`);
        }, 2000);
      } else {
        toast.error(data.message);
        setErrorMessage(data.message); // Set error message for display
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error('Server error! Please try again later.');
      setErrorMessage('Server error! Please try again later.'); // Set error message for display
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Verify Your Code</h1>
      {user ? (
        <p className="mb-6 text-gray-600">We've sent a password reset code to <strong>{user.email}</strong>.</p>
      ) : (
        <p className="mb-6 text-gray-600">Loading user data...</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-sm">
        <input
          type="text"
          placeholder="Enter Verification Code"
          value={code}
          onChange={handleCodeChange}
          className={`border border-gray-300 rounded-md p-2 mb-4 w-full ${errorMessage ? 'border-red-500' : ''}`}
          required
          aria-describedby="code-error"
        />
        {errorMessage && <span id="code-error" className="text-red-500 mb-2">{errorMessage}</span>}
        <button
          type="submit"
          className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? <ClipLoader size={20} color="#fff" /> : 'Verify Code'}
        </button>
      </form>
      <ToastContainer aria-live="polite" /> {/* Improved accessibility */}
    </div>
  );
};

export default PasswordResetVerify;