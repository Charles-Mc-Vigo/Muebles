import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
export default function SignUp() {
	const [formData, setFormData] = useState({});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
		console.log(formData);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("http://localhost:3000/api/users/signup",formData)
			console.log(response.data);

		} catch (error) {
			console.error("Sign up error",error.response.data)
		}
	}
	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-center font-semibold my-7 text-3xl">
				Welcome to Muebles!
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
				<div className="flex justify-between mx-4">
					<label htmlFor="Gender">Gender</label>
					<div name="Gender" className="flex gap-4">
						<input
							type="radio"
							id="male"
							name="gender"
							value="male"
							required
							onChange={handleChange}
						/>
						<label htmlFor="male">Male</label>
						<input
							type="radio"
							id="female"
							name="gender"
							value="female"
							required
							onChange={handleChange}
						/>
						<label htmlFor="female">Female</label>
					</div>
				</div>
				<input
					type="tel"
					placeholder="+639XXXXXXXXX"
					id="phoneNumber"
					required
					className="bg-slate-100 p-3 rounded-lg"
					onChange={handleChange}
				/>
				<select
					name="municipality"
					id="municipality"
					required
					onChange={handleChange}
					defaultValue=""
				>
					<option value="" disabled hidden>
						Select Municipality
					</option>
					<option value="Boac">Boac</option>
					<option value="Mogpog">Mogpog</option>
					<option value="SantaCruz">Santa Cruz</option>
					<option value="Gasan">Gasan</option>
					<option value="Buenavista">Buenavista</option>
					<option value="Torrijos">Torrijos</option>
				</select>
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
						<Link to="/login">
							<span className="text-blue-500">Log in</span>
						</Link>
					</p>
				</div>
			</form>
		</div>
	);
}
