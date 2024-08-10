import React from 'react'
import { Link } from 'react-router-dom';

export default function Login() {
	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-center font-semibold my-7 text-3xl">Welcome to Muebles!</h1>
			<form className="flex flex-col gap-4">
				<input
					type="email"
					placeholder="Email"
					id="email"
					required
					className="bg-slate-100 p-3 rounded-lg"
				/>
				<input
					type="password"
					placeholder="Password"
					id="password"
					required
					className="bg-slate-100 p-3 rounded-lg"
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
