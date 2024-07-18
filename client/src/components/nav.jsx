import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Nav() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<div className="bg-slate-400">
			<div className="flex flex-wrap justify-between items-center max-w-6xl mx-auto p-5">
				<div>
					<h1 className="font-bold cursor-pointer">JCKAME</h1>
				</div>
				<button
					className="lg:hidden"
					onClick={() => setIsMenuOpen(!isMenuOpen)}
				>
					Menu
				</button>
				<div className={`w-full lg:w-auto ${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
					<ul className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4 mt-4 lg:mt-0">
						<Link><li className="hover:opacity-60 hover:text-white">Shop Now!</li></Link>
						<Link><li className="hover:opacity-60 hover:text-white">About Us</li></Link>
						<Link><li className="hover:opacity-60 hover:text-white">Featured</li></Link>
						<Link><li className="hover:opacity-60 hover:text-white">Services</li></Link>
						<Link><li className="hover:opacity-60 hover:text-white">Testimony</li></Link>
					</ul>
				</div>
				<div className={`w-full lg:w-auto ${isMenuOpen ? 'block' : 'hidden'} lg:block mt-4 lg:mt-0`}>
					<ul className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4">
						<Link to="/login"><li className="hover:opacity-60 hover:text-white">Log in</li></Link>
						<Link to="/signup"><li className="hover:opacity-60 hover:text-white">Sign in</li></Link>
					</ul>
				</div>
			</div>
		</div>
	);
}