import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminSignUp() {
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

		// // console.log("Form data to be submitted:", { ...admin, zipCode }); //for debugging
		// try {
		// 	const response = await axios.post(
		// 		"http://localhost:3000/api/users/signup",
		// 		{
		// 			...admin,
		// 			headers: {
		// 				'Content-Type': 'application/json',
		// 			},
		// 		}
		// 	);

		// 	// console.log(response.data); //for debugging
		// 	navigate('/verify-email');
		// } catch (error) {
		// 	console.error("Sign up error", error.response?.data || error.message);
		// 	alert(error.response?.data?.message || error.message || "Sign up failed");
		// }
	};
	return (
		<div className="p-3 max-w-lg mx-auto">
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
