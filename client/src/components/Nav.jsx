import React from "react";
import { Link } from 'react-router-dom';
import { TiShoppingCart } from "react-icons/ti";

const Nav = () => {
	return (
		<>
			<nav className="flex justify-between m-auto items-center align-baseline max-w-lg max-md">
				<h1>JCKAME</h1>
				<ul className="flex gap-2 text-center align-baseline justify-center p-4">
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/pages/About">About</Link>
					</li>
					<li>
						<Link to="/services">Services</Link>
					</li>
					<li>
						<Link to="/contact">Contact</Link>
					</li>
				</ul>
				<div className="flex items-center">
					<button className="mr-4">
						<Link to="/cart">
							<TiShoppingCart/>
						</Link>
					</button>
					<button className="bg-red-500 text-white px-4 py-2 rounded">
						<Link to="/logout">Logout</Link>
					</button>
				</div>
			</nav>
		</>
	);
};

export default Nav;
