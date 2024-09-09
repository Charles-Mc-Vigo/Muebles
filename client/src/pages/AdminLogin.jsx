import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const AdminLogin = () => {
  const [admin, setAdmin] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setAdmin({ ...admin, [id]: value });
    console.log(admin); //for debugging
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/admins/login', {
        email: admin.email,
        password: admin.password
      });

      // console.log('check if user has token',response.data.token) //debugging

      // Check if the user is an admin
      if (response.data.token) {
        // Store the token and navigate to the admin dashboard
        Cookies.set('adminToken', response.data.token, {
          expires: 3, // Token expiration in days
          secure: process.env.NODE_ENV === 'production' // Use HTTPS in production
        });

        alert('Admin Logged in successfully');
        navigate('/dashboard');
      } else {
        alert('You do not have admin privileges.');
      }
    } catch (error) {
      console.error("Admin Login error", error.response?.data || error.message);
      alert(error.response?.data?.message || error.message || "Admin Login failed");
    }
    console.log(admin)
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
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
