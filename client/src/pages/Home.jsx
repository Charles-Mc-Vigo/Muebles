import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Home = () => {
	const [furnitureData, setFurnitureData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [visibleCount, setVisibleCount] = useState(6); // Initial number of visible items

	// Fetch the furniture data from API


	useEffect(() => {
		const fetchFurnitureData = async () => {
			try {
				const response = await fetch("http://localhost:3000/api/furnitures");
				if (!response.ok) {
					throw new Error("Failed to fetch furniture sets");
				}
				const data = await response.json();
				console.log("Fetched Data:", data); // Log to check the structure of data
	
				if (Array.isArray(data)) {
					setFurnitureData(data);
				} else if (data && Array.isArray(data.furnitures)) {
					setFurnitureData(data.furnitures);
				} else {
					throw new Error("Invalid data format received");
				}
				setLoading(false);
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		};
		
		fetchFurnitureData();
	}, []);

	const loadMore = () => {
		setVisibleCount((prevCount) => prevCount + 6); // Increase the visible count
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="bg-white text-gray-800">
			{/* Header */}
			<Header showLogout={true} />
			{/* Shop Hero Section */}
			<section className="relative">
				<img
					src="https://images.pexels.com/photos/245219/pexels-photo-245219.jpeg?auto=compress&cs=tinysrgb&w=600"
					alt="Shop Hero"
					className="w-full h-80 object-cover"
				/>
				<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-center">
					<h1 className="text-5xl font-bold">Browse Our Collection</h1>
				</div>
			</section>

			{/* Furniture Sets Section */}
			<section className="py-16 px-8 bg-gray-50">
				<h2 className="text-4xl font-bold text-center mb-10">Furniture Sets</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{furnitureData.slice(0, visibleCount).map((furniture) => (
						<ProductCard
							key={furniture._id} // Ensure this id is unique for each furniture item
							id={furniture._id}
							image={furniture.image}
							name={furniture.name}
							price={furniture.price}
							description={furniture.description}
						/>
					))}
				</div>

				{visibleCount < furnitureData.length && ( // Check if there are more items to load
					<div className="text-center mt-8">
						<button
							onClick={loadMore}
							className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
						>
							Load More
						</button>
					</div>
				)}
			</section>

			{/* Footer */}
			<Footer />
		</div>
	);
};

export default Home;
