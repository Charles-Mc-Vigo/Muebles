import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

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

	const handleChange = (e) => {
		const { id, value } = e.target;
		setAdmin({ ...admin, [id]: value });
		console.log(admin);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:3000/api/admin/signup", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(admin),
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Admin sign up failed");
			}
			const data = await response.json();
			if (!data || !data.newAdmin._id) {
				throw new Error("No admin ID received from server");
			}
			const adminId = data.newAdmin._id;
			console.log(adminId)
			toast.success(data.message); // Notify success
			navigate(`/admin-signup/verify-account/${adminId}`);
		} catch (error) {
			console.error("Sign up error", error.message);
			toast.error(error.message || "Sign up failed"); // Notify error
		}
	};

	return (
		<div className="p-3 max-w-lg mx-auto">
			<ToastContainer /> {/* Add ToastContainer to render toasts */}
			<h1 className="text-center font-semibold my-7 text-3xl">
				Admin Sign Up
			</h1>
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
				<input
					type="password"
					placeholder="Password"
					id="password"
					required
					className="bg-slate-100 p-3 rounded-lg"
					onChange={handleChange}
				/>
				<input
					type="password"
					placeholder="Confirm password"
					id="confirmPassword"
					required
					className="bg-slate-100 p-3 rounded-lg"
					onChange={handleChange}
				/>
				<button
					type="submit"
					className="p-3 bg-slate-500 rounded-lg text-slate-50 font-bold uppercase hover:opacity-80 disabled:opacity-70"
				>
					Sign up
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