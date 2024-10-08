import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaFingerprint } from 'react-icons/fa'; 
import Header from '../components/Header'; // Assuming you have this component
import Footer from '../components/Footer'; // Assuming you have a Footer component

export default function Login() {
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData({ ...formData, [id]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post('http://localhost:3000/api/users/login', {
				...formData,
				headers: { 'Content-Type': 'application/json' }
			});
			if (response.data.token) {
				Cookies.set('authToken', response.data.token, {
					expires: 3,
					secure: process.env.NODE_ENV === 'production'
				});
				alert('Logged in successfully');
				navigate('/home');
			} else {
				alert('Login unsuccessful');
			}
		} catch (error) {
			console.error("Log in error", error.response?.data || error.message);
			alert(error.response?.data?.message || error.message || "Log in failed");
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-fill" >
			<Header />
			{/* Main content (Login form) */}
			<div className="flex-grow flex justify-center items-center">
				<div className="bg-teal-800 bg-opacity-90 p-6 md:p-10 rounded-lg max-w-md w-full">
					<div className="flex justify-center mb-6">
						<FaFingerprint className="text-white text-4xl" />
					</div>
					<h1 className="text-center text-white text-2xl font-semibold mb-6">Log In</h1>
					<form onSubmit={handleSubmit} className="space-y-4">
						<input
							type="email"
							id="email"
							placeholder="E-mail address"
							required
							onChange={handleChange}
							className="w-full px-4 py-2 text-white bg-transparent border-b-2 border-gray-300 placeholder-gray-300 focus:outline-none focus:border-white"
						/>
						<input
							type="password"
							id="password"
							placeholder="Password"
							required
							onChange={handleChange}
							className="w-full px-4 py-2 text-white bg-transparent border-b-2 border-gray-300 placeholder-gray-300 focus:outline-none focus:border-white"
						/>
						<button
							type="submit"
							className="w-full py-3 mt-6 bg-white text-teal-800 font-bold rounded-full hover:bg-gray-100 transition-colors"
						>
							Log In
						</button>
					</form>
					<p className="text-white text-sm text-center mt-4">
						Don't have an account?{" "}
						<Link to="/SignUp" className="underline">Sign up Now</Link>.
					</p>
					<p className="text-white text-sm text-center mt-2">
						Forgot password?{" "}
						<Link to="/login" className="underline">Click here</Link>.
					</p>
				</div>
			</div>

			{/* Footer at the bottom */}
			<Footer />
		</div>
	);
}
