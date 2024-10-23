import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Collection from "./Collection";
import FAQAccordion from "./FAQAccordion";
import FAQPage from "./FAQpage";
import Carousel from "./Carousel";

export default function Hero() {
	const images = [
		"/Advertisement/carouselimages/1.png",
		"/Advertisement/carouselimages/2.png",
		"/Advertisement/carouselimages/3.png",
		"/Advertisement/carouselimages/4.png",
		"/Advertisement/carouselimages/5.png",
		"/Advertisement/carouselimages/6.png",
	];

	const navigate = useNavigate();

	const toHomePage = () => {
		navigate("/home");
	};

	return (
		<div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-1 max-w-7xl m-auto mt-2 p-4">
				<div className="lg:col-span-2 ">
					<Carousel images={images} />
				</div>

				<div className="text-center lg:text-left">
					<h1 className="text-4xl lg:text-7xl mb-2 lg:mb-4 font-semi-bold font-sans white space-x-1">
						Discover the Beauty of Handcrafted Wood Furniture!
					</h1>
					<p className="text-2xl lg:text-2xl mb-4 lg:mb-4 text-black">
						Experience the timeless elegance and natural warmth of our exquisite
						wood furniture collection
					</p>
					<div className="flex flex-col items-center lg:items-start">
						<button
							className="flex flex-row items-center gap-3 rounded-md py-3 px-6 mt-6 bg-slate-700 text-white hover:opacity-60"
							onClick={toHomePage}
						>
							Shop now!
							<FaShoppingCart />
						</button>
					</div>
				</div>

				<div className="flex justify-center lg:justify-end">
					<img className="w-full h-auto" src="/furniture.jpg" alt="furniture" />
				</div>

				<div className="lg:col-span-2">
					<Collection />
				</div>

				<div className="lg:col-span-2 flex flex-col md:flex-row md:justify-between items-start gap-8">
					<div className="md:w-1/2 justify-center mt-0">
						<FAQPage />
					</div>
					<div className="md:w-1/2 mt-10">
						<FAQAccordion />
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
