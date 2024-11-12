import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const AdminLogin = () => {
  const [admin, setAdmin] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setAdmin({ ...admin, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: admin.email,
          password: admin.password
        }),
        credentials: 'include' // This is important for including cookies in the request/response
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Admin Login failed");
      }
      const data = await response.json();
      toast.success('Admin Logged in successfully');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error("Admin Login error", error.message);
      toast.error(error.message || "Admin Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <ToastContainer />
      <h1 className="text-center font-semibold my-7 text-3xl">Admin Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          id="email"
          required
          onChange={handleChange}
          className="bg-slate-100 p-3 rounded-lg"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            id="password"
            required
            onChange={handleChange}
            className="bg-slate-100 p-3 rounded-lg w-full"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
          </button>
        </div>
        <button
          type="submit"
          className={`py-4 px-24 rounded-lg mx-auto text-white font-bold uppercase hover:opacity-80 disabled:opacity-70 ${
            loading ? "bg-blue-400" : "bg-blue-500"
          }`}
          style={{ display: "block", margin: "20px auto 0" }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;