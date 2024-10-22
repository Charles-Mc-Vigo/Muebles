import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss(); // Dismiss any existing toast messages
    setIsLoading(true); // Set loading state to true

    try {
      const response = await fetch('http://localhost:3000/api/users/password-reset/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message); // Show success toast
      } else {
        toast.error(data.message); // Show error toast
      }

      const userId = data.user._id;
      setTimeout(()=>{
        navigate(`/password-reset/verify/${userId}`);
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
      <h1 className="text-2xl font-bold mb-4">Password Reset</h1>
      <p className="mb-6">Enter your email to receive a password reset code.</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={handleEmailChange}
          className="border border-gray-300 rounded-md p-2 mb-4 w-80"
          required
        />
        <button
          type="submit"
          className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading} // Disable the button while loading
        >
          {isLoading ? 'Loading...' : 'Get Password Reset Code'}
        </button>
      </form>
      <ToastContainer /> {/* Add ToastContainer to render the toasts */}
    </div>
  );
}

export default PasswordResetRequest;