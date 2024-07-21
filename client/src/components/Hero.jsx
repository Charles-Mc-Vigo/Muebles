import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Hero() {
	return (
		<div className="flex flex-col lg:flex-row max-w-7xl m-auto mt-10 p-4">
			<div className="text-center lg:text-left">
				<h1 className="text-4xl lg:text-7xl mb-4 lg:mb-0 lg:mr-4">
					Discover the Beauty of Handcrafted Wood Furniture!
				</h1>
				<div className="flex flex-col items-center lg:items-start">
					<Link to="/login">
						<button className="flex flex-row items-center gap-3 rounded-md py-3 px-6 mt-6 bg-slate-700 text-white hover:opacity-60">
							Shop now!
							<FaShoppingCart />
						</button>
					</Link>
				</div>
			</div>
			<img
				className="w-full lg:w-2/5 max-w-full h-auto mt-6 lg:mt-0"
				src="/furniture.jpg"
				alt="furniture"
			/>
		</div>
	);
}
