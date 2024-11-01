import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
	const [furnitureData, setFurnitureData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [visibleCount, setVisibleCount] = useState(8);
	const [cartCount, setCartCount] = useState(0);

	// Fetch furniture data
	useEffect(() => {
		const fetchFurnitureData = async () => {
			try {
				const response = await fetch("http://localhost:3000/api/furnitures", {
					method: "GET",
					credentials: "include",
				});
				if (!response.ok) throw new Error("Failed to fetch furniture sets");
				const data = await response.json();

				if (Array.isArray(data)) {
					setFurnitureData(data);
				} else if (data?.furnitures) {
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

	// Fetch cart count
	const fetchCartCount = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/cart", {
				method: "GET",
				credentials: "include",
			});
			if (!response.ok) throw new Error("Failed to fetch cart count");

			const data = await response.json();
			setCartCount(data.cart.count || 0); // Update cart count based on API response
		} catch (error) {
			console.error("Error fetching cart count:", error);
		}
	};

	const handleCartRefresh = async () => {
		await fetchCartCount();
	};

	useEffect(() => {
		fetchCartCount(); // Fetch cart count when the component mounts
	}, []);

	const loadMore = () => {
		setVisibleCount((prevCount) => prevCount + 8);
	};

	const showToast = (message, type) => {
		toast[type](message);
	};

	const incrementCartCount = () => {
		setCartCount((prevCount) => prevCount + 1);
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center text-red-600">
				<p>Error: {error}</p>
			</div>
		);
	}

	return (
		<div className="bg-white text-gray-800 flex flex-col min-h-screen">
			<Header isLogin={true} cartCount={cartCount} />
			<ToastContainer
				style={{ top: "80px", right: "50px" }}
				autoClose={3000}
				hideProgressBar
			/>

			{/* Hero Section */}
			<section className="relative w-full h-48 sm:h-64 md:h-80">
				<img
					src="https://images.pexels.com/photos/245219/pexels-photo-245219.jpeg?auto=compress&cs=tinysrgb&w=600"
					alt="Shop Hero"
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center px-4">
						Browse Our Collection
					</h1>
				</div>
			</section>

			{/* Main Content */}
			<div className="flex flex-col flex-1 max-w-7xl mx-auto w-full px-4 py-6 gap-6">
				<main className="flex-1">
					<h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
						Furniture Sets
					</h2>

					<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
						{furnitureData.slice(0, visibleCount).map((furniture) => (
							<ProductCard
								key={furniture._id}
								id={furniture._id}
								images={furniture.images}
								name={furniture.name}
								price={furniture.price}
								description={furniture.description}
								showViewDetails={true}
								showAddToCart={true}
								showUpdateButton={false}
								showToast={showToast}
								onAddToCart={() => {
									incrementCartCount(); // Increment local cart count
									fetchCartCount(); // Refresh cart count from API
								}}
								onRefresh={handleCartRefresh}
							/>
						))}
					</div>

					{visibleCount < furnitureData.length && (
						<div className="text-center mt-8">
							<button
								onClick={loadMore}
								className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
							>
								Load More
							</button>
						</div>
					)}
				</main>
			</div>

			<Footer />
		</div>
	);
};

export default Home;
