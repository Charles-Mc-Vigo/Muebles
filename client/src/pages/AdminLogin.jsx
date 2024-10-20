import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin = () => {
  const [admin, setAdmin] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setAdmin({ ...admin, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        <input
          type="password"
          placeholder="Password"
          id="password"
          required
          onChange={handleChange} 
          className="bg-slate-100 p-3 rounded-lg"
        />
        <button
          type="submit"
          className="p-3 bg-slate-500 rounded-lg text-slate-50 font-bold uppercase hover:opacity-80 disabled:opacity-70"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;