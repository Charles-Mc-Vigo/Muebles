import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

export default function AdminSignUp() {
	const navigate = useNavigate();
	const [admin, setAdmin] = useState({
		firstname: "",
		lastname: "",
		gender: "",
		phoneNumber: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false); // State for password visibility
	const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

	const handleChange = (e) => {
		const { id, value } = e.target;
		setAdmin({ ...admin, [id]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await fetch("http://localhost:3000/api/admin/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(admin),
			});
			const data = await response.json();
			console.log("Response Data:", data); // Log response for debugging
			if (!response.ok) {
				toast.error(data.message || "Admin sign up failed");
				return; // Exit early if there's an error
			}
			// Check if newAdmin and its ID are present
			if (!data.newAdmin || !data.newAdmin._id) {
				throw new Error("No admin ID received from server");
			}
			const adminId = data.newAdmin._id;
			toast.success(data.message); // Notify success
			navigate(`/admin-signup/verify-account/${adminId}`); // Navigate to the verify account page
		} catch (error) {
			console.error("Sign up error", error.message);
			toast.error(error.message || "Sign up failed"); // Notify error
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-3 max-w-lg mx-auto">
			<ToastContainer /> {/* Add ToastContainer to render toasts */}
			<h1 className="text-center font-semibold my-7 text-3xl">Admin Sign Up</h1>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Firstname"
					id="firstname"
					required
					className="bg-slate-100 p-3 rounded-lg"
					onChange={handleChange}
				/>
				<input
					type="text"
					placeholder="Lastname"
					id="lastname"
					required
					className="bg-slate-100 p-3 rounded-lg"
					onChange={handleChange}
				/>
				<select
					id="gender"
					value={admin.gender}
					onChange={handleChange}
					required
					className="bg-slate-100 p-3 rounded-lg"
				>
					<option value="" disabled hidden>
						Gender
					</option>
					<option value="Male">Male</option>
					<option value="Female">Female</option>
				</select>
				<input
					type="tel"
					placeholder="+639XXXXXXXXX"
					id="phoneNumber"
					required
					className="bg-slate-100 p-3 rounded-lg"
					onChange={handleChange}
				/>
				<input
					type="email"
					placeholder="Email"
					id="email"
					required
					className="bg-slate-100 p-3 rounded-lg"
					onChange={handleChange}
				/>
				<div className="relative">
					<input
						type={showPassword ? "text" : "password"}
						placeholder="Password"
						id="password"
						required
						className="bg-slate-100 p-3 rounded-lg w-full"
						onChange={handleChange}
					/>
					<button
						type="button"
						className="absolute right-3 top-1/2 transform -translate-y-1/2"
						onClick={() => setShowPassword(!showPassword)}
					>
						{showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
					</button>
				</div>
				<div className="relative">
					<input
						type={showConfirmPassword ? "text" : "password"}
						placeholder="Confirm password"
						id="confirmPassword"
						required
						className="bg-slate-100 p-3 rounded-lg w-full"
						onChange={handleChange}
					/>
					<button
						type="button"
						className="absolute right-3 top-1/2 transform -translate-y-1/2"
						onClick={() => setShowConfirmPassword(!showConfirmPassword)}
					>
						{showConfirmPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
					</button>
				</div>
				<button
					type="submit"
					className={`p-3 rounded-lg text-slate-50 font-bold uppercase hover:opacity-80 disabled:opacity-70 ${
						loading ? "bg-gray-400" : "bg-slate-500"
					}`}
					disabled={loading}
				>
					{loading ? "Signing up..." : "Sign up"}
				</button>
				<div>
					<p>
						Already have an account?{" "}
						<Link to="/admin-login">
							<span className="text-blue-500">Login</span>
						</Link>
					</p>
				</div>
			</form>
		</div>
	);
}