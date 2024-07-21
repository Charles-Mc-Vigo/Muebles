import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLogin() {
	const [formData, setFormData] = useState({});
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData({ ...formData, [id]: value });
		console.log(formData);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				"http://localhost:3000/api/users/login",
				formData
			);
			console.log(response.data);

			localStorage.setItem("userToken", response.data.token);
			localStorage.setItem("isAuthenticated", "true");
			
			alert("Login successfully!");
			navigate("/home");
		} catch (error) {
			console.error("Login error", error.response?.data || error.message);
			alert(error.response?.data?.message || error.message || "Login failed");
		}
	};
	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-center font-semibold my-7 text-3xl">
				Admin Page
			</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

				<button
					type="submit"
					className="p-3 bg-slate-500 rounded-lg text-slate-50 font-bold uppercase hover:opacity-80 disabled:opacity-70"
				>
					Log In
				</button>
				<div>
					<p>
						Don't have an account?{" "}
						<Link to="/signup">
							<span className="text-blue-500">Sign Up</span>
						</Link>
					</p>
				</div>
			</form>
		</div>
	);
}
