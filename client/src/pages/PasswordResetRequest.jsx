import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners'; // Import a spinner component

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage(''); // Clear error message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    setIsLoading(true);

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
        toast.success(data.message);
        const userId = data.user._id;
        setTimeout(() => {
          navigate(`/password-reset/verify/${userId}`);
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
      <h1 className="text-3xl font-bold mb-4">Password Reset</h1>
      <p className="mb-6 text-gray-600">Enter your email to receive a password reset code.</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-sm">
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={handleEmailChange}
          className={`border border-gray-300 rounded-md p-2 mb-4 w-full ${errorMessage ? 'border-red-500' : ''}`}
          required
          aria-describedby="email-error"
        />
        {errorMessage && <span id="email-error" className="text-red-500 mb-2">{errorMessage}</span>}
        <button
          type="submit"
          className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? <ClipLoader size={20} color="#fff" /> : 'Get Password Reset Code'}
        </button>
      </form>
      <ToastContainer aria-live="polite" /> {/* Improved accessibility */}
    </div>
  );
}

export default PasswordResetRequest;