import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/users/login', {
        email: formData.email,
        password: formData.password
      });

      // Check if the user is an admin
      if (response.data.isAdmin) {
        // Store the token and navigate to the admin dashboard
        localStorage.setItem('adminToken', response.data.token);
        alert('Admin Logged in successfully');
        navigate('/dashboard');
      } else {
        alert('You do not have admin privileges.');
      }
    } catch (error) {
      console.error("Admin Login error", error.response?.data || error.message);
      alert(error.response?.data?.message || error.message || "Admin Login failed");
    }
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
