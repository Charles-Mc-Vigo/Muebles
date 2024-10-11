import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ViewProduct() {
	const { id } = useParams();
	const [furniture, setFurniture] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [quantity, setQuantity] = useState(1); // State for quantity

	useEffect(() => {
		const fetchFurniture = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/api/furnitures/${id}`
				);
				if (!response.ok) {
					throw new Error("Failed to fetch furniture details");
				}
				const data = await response.json();
				setFurniture(data);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchFurniture();
	}, [id]);

	if (loading) return <div className="text-center text-xl">Loading...</div>;
	if (error) return <div className="text-red-600 text-center">Error: {error}</div>;

	// Ensure that furniture is not null before rendering
	if (!furniture) return <div>No product found.</div>;

	const incrementQuantity = () => {
		setQuantity((prevQuantity) => prevQuantity + 1);
	};

	const decrementQuantity = () => {
		setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="max-w-7xl w-full h-[85vh] p-6 bg-white rounded-lg shadow-lg">
				<div className="flex space-x-10 h-full">
					{/* Left Section: Image, Ratings */}
					<div className="w-1/2">
						{/* Image */}
						<img
							src={`data:image/jpeg;base64,${furniture.image}`}
							alt={furniture.name}
							className="w-full h-auto object-cover rounded-md mb-6"
						/>

						{/* Ratings */}
						<div className="mb-4">
							<span className="text-gray-600">Ratings are unavailable</span>
						</div>
					</div>

					{/* Right Section: Title, Description, and Color Options */}
					<div className="w-1/2 flex flex-col justify-between">
						{/* Product Title */}
						<h2 className="text-3xl font-bold text-gray-800 mb-2 self-center">
							{furniture.name}
						</h2>

						{/* Gray Div for Description */}
						<div className="w-full h-1/2 bg-gray-300 mt-4">
							{/* Description */}
							<p className="mt-2 text-gray-600 text-lg">
								{furniture.description}
							</p>
						</div>

						{/* Color Options */}
            <div className="flex items-center space-x-2 mt-4">
	<label className="mr-4 text-lg">Available Ngulay:</label>
	<div className="flex space-x-2">
		{furniture.colors &&
			furniture.colors.map((color, index) => (
				<button
					key={index}
					className="border p-2 rounded hover:bg-gray-100"
				>
					{typeof color === "string" ? color : color.name}
				</button>
			))}
	</div>
</div>


						{/* Price and Discount */}
						<div className="mb-4">
							<span className="text-xl text-green-600 mr-2">
								{furniture.price}
							</span>
							<span className="line-through text-gray-500">
								{furniture.originalPrice}
							</span>
						</div>

						{/* Quantity Selection */}
						<div className="justify-end flex items-center gap-3">
            <label className="mr-4 text-lg">Quantity:</label>
	
							<button onClick={decrementQuantity} className="border px-3 py-1 rounded-l-md bg-gray-200 hover:bg-gray-300">
								-
							</button>
							<input
								type="number"
								value={quantity}
								readOnly
								className="border p-2 w-50 text-center"
							/>
							<button onClick={incrementQuantity} className="border px-3 py-1 rounded-r-md bg-gray-200 hover:bg-gray-300">
								+
							</button>
						</div>

						{/* Action Buttons Container */}
						<div className="flex space-x-4 justify-end">
							<button className="bg-green-600 text-white py-2 px-4 rounded-md transition-colors duration-300 hover:bg-green-700">
								Add to Cart
							</button>
							<button className="bg-orange-500 text-white py-2 px-4 rounded-md transition-colors duration-300 hover:bg-orange-600">
								Buy Now
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ViewProduct;