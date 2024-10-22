import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFingerprint } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

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
				credentials:'include',
				body: JSON.stringify(formData),
			});

			if(!response.ok){
				toast.error("Something went wrong!")
			}

			const data = await response.json();

			toast.success("Logged in successfully");
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
			<div className="bg-teal-800 bg-opacity-90 p-6 md:p-10 rounded-lg max-w-md w-full">
				<div className="flex justify-center mb-6">
					<FaFingerprint className="text-white text-4xl" />
				</div>
				<h1 className="text-center text-white text-2xl font-semibold mb-6">
					Log In
				</h1>
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
					<Link to="/SignUp" className="underline">
						Sign up Now
					</Link>
					.
				</p>
				<p className="text-white text-sm text-center mt-2">
					Forgot password?{" "}
					<Link to="/password-reset/request" className="underline">
						Click here
					</Link>
					.
				</p>
			</div>
			<ToastContainer />
		</div>
	);
}
