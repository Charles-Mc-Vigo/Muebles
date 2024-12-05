import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFingerprint, FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

export default function Login() {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData({ ...formData, [id]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await fetch("http://localhost:3000/api/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(formData),
			});
			if (!response.ok) {
				const errorData = await response.json();
				toast.error(errorData.error);
				return;
			}
			const data = await response.json();
			toast.success("Logged in successfully");
			setTimeout(() => {
				navigate("/home");
			}, 2000);
		} catch (error) {
			console.error("Log in error", error);
			toast.error(error.message || "Log in failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Header />
			<div
				className="min-h-screen flex flex-col justify-center items-center mb-5 mt-5"
				style={{
					backgroundImage: "url(/landingimage/login.png)",
					backgroundSize: "contain",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			>
				<div className="bg-green-800 bg-opacity-90 p-10 md:p-12 rounded-lg max-w-lg w-full relative shadow-lg">
					{/* Back Button */}
					<button
						onClick={() => navigate(-1)}
						className="absolute top-4 left-4 text-white hover:text-gray-300"
						aria-label="Go back"
					>
						<FaArrowLeft className="text-xl" />
					</button>
					<div className="flex justify-center mb-6">
						<FaFingerprint className="text-white text-4xl" />
					</div>
					<h1 className="text-center text-white text-3xl font-semibold mb-6">
						Log In
					</h1>
					<form onSubmit={handleSubmit} className="space-y-6">
						<input
							type="email"
							id="email"
							placeholder="E-mail address"
							required
							onChange={handleChange}
							className="bg-slate-100 p-3 rounded w-full"
						/>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								placeholder="Password"
								required
								onChange={handleChange}
								className="bg-slate-100 p-3 rounded w-full"
							/>
							<button
								type="button"
								className="absolute right-3 top-1/2 transform -translate-y-1/2"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<FaEyeSlash className="text-black" />
								) : (
									<FaEye className="text-black" />
								)}
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
			</div>
			<Footer />
			<ToastContainer />
		</>
	);
}
