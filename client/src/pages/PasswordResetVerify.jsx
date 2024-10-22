import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const PasswordResetVerify = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [code, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state for the button

  const navigate = useNavigate();

  const handleCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`);
      if (!response.ok) {
        throw new Error("User not found");
      }
      const userData = await response.json();
      setUser(userData); // Set the entire user object
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
    toast.dismiss(); // Dismiss any existing toast messages
    setIsLoading(true); // Set loading state to true
    try {
      const response = await fetch(`http://localhost:3000/api/users/password-reset/verify/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }), // Send both email and verification code
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message); // Show success toast
        // You may want to redirect or perform other actions here
      } else {
        toast.error(data.message); // Show error toast
      }
      setTimeout(()=>{
        navigate(`/password-reset/new-password/${userId}`);
      },2000)
    } catch (error) {
      console.error("Error:", error);
      toast.error('Server error! Please try again later.'); // Show error toast
    } finally {
      setIsLoading(false); // Set loading state back to false
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Verify Your Code</h1>
      {user ? (
        <p className="mb-6">We've sent a Password-reset code to {user.email}</p>
      ) : (
        <p className="mb-6">Loading user data...</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Verification Code"
          value={code}
          onChange={handleCodeChange}
          className="border border-gray-300 rounded-md p-2 mb-4 w-80"
          required
        />
        <button
          type="submit"
          className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading} // Disable the button while loading
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>
      <ToastContainer /> {/* Add ToastContainer to render the toasts */}
    </div>
  );
};

export default PasswordResetVerify;