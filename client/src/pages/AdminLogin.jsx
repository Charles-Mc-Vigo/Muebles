import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

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
      });

      // Check if the response is OK (status in the range 200-299)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Admin Login failed");
      }

      const data = await response.json();
      if (!data || !data._id) {
        throw new Error("No admin ID received from server");
      }

      const adminId = data._id;

      console.log(adminId)
      // console.log('check if user has token', data.token) // debugging

      // // Check if the user is an admin
      // if (data.token) {
      //   // Store the token and navigate to the admin dashboard
      //   Cookies.set('adminToken', data.token, {
      //     expires: 3, // Token expiration in days
      //     secure: process.env.NODE_ENV === 'production' // Use HTTPS in production
      //   });
      //   toast.success('Admin Logged in successfully');
      //   navigate(`/${data.adminId}/dashboard`); // Assuming adminId is part of the response
      // } else {
      //   toast.error('You do not have admin privileges.');
      // }

        toast.success('Admin Logged in successfully');
        setTimeout(()=> {
          navigate(`/${adminId}/dashboard`);
        },3000)
    } catch (error) {
      console.error("Admin Login error", error.message);
      toast.error(error.message || "Admin Login failed");
    }
    // console.log(admin);
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
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