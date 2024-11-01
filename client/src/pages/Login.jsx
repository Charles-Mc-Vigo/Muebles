import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFingerprint, FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:3000/api/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(formData),
			});
			const data = await response.json();
			
			if (!response.ok) {
				// Handle error case
				toast.error(data.error || "Log in failed");
				return; // Do not proceed further
			}

			// Handle success case
			toast.success(data.success);
			setTimeout(() => {
				navigate("/home");
			}, 2000);
		} catch (error) {
			console.error("Log in error", error);
			toast.error(error.message || "Log in failed");
		}
	};

	return (
		<div
			className="min-h-screen bg-fill flex justify-center items-center"
			style={{
				backgroundImage: "url(/landingimage/jckamecover.jpg)",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div className="bg-teal-800 bg-opacity-90 p-6 md:p-10 rounded-lg max-w-md w-full relative">
				{/* Back Button */}
				<button
					onClick={() => navigate(-1)}
					className="absolute top-4 left-4 text-white hover:text-gray-300"
				>
					<FaArrowLeft className="text-xl" />
				</button>
				<div className="flex justify-center mb-6">
					<FaFingerprint className="text-white text-4xl" />
				</div>
				<h1 className="text-center text-white text-3xl font-semibold mb-6">
					Log In
				</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="email"
						id="email"
						placeholder="E-mail address"
						required
						value={formData.email} // Bind input value to state
						onChange={handleChange}
						className="w-full px-4 py-2 text-white bg-transparent border-b-2 border-gray-300 placeholder-gray-300 focus:outline-none focus:border-white transition duration-200"
					/>
					<input
						type="password"
						id="password"
						placeholder="Password"
						required
						value={formData.password} // Bind input value to state
						onChange={handleChange}
						className="w-full px-4 py-2 text-white bg-transparent border-b-2 border-gray-300 placeholder-gray-300 focus:outline-none focus:border-white transition duration-200"
					/>
					<button
						type="submit"
						className="w-full py-3 mt-6 bg-white text-teal-800 font-bold rounded-full hover:bg-gray-100 transition-colors duration-300"
					>
						Log In
					</button>
				</form>
				<p className="text-white text-sm text-center mt-4">
					Don't have an account?{" "}
					<Link to="/SignUp" className="underline hover:text-gray-300">
						Sign up Now
					</Link>
					.
				</p>
				<p className="text-white text-sm text-center mt-2">
					Forgot password?{" "}
					<Link
						to="/password-reset/request"
						className="underline hover:text-gray-300"
					>
						Click here
					</Link>
					.
				</p>
			</div>
			<ToastContainer />
		</div>
	);
}