import React from "react";
import { Link } from "react-router-dom";

export default function nav() {
	return (
		<div className="bg-slate-400">
			<div className="flex justify-between items-center max-w-6xl mx-auto p-5">
				<h1 className="font-bold">MUEBLES</h1>
				<ul className="flex gap-4">
					<Link to="/login">
						<li>Log in</li>
					</Link>
					<Link to="/signup">
						<li>Sign in</li>
					</Link>
				</ul>
			</div>
		</div>
	);
}
