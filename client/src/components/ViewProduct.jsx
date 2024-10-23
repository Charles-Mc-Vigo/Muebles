import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

function ViewProduct() {
	const [furnitureData, setFurnitureData] = useState([]); // Correct casing for consistency
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchFurniture = async () => {
			try {
				const response = await fetch(`http://localhost:3000/api/furnitures`,{
					method:'GET',
					credentials:'include'
				});
				if (!response.ok) {
					throw new Error("Failed to fetch furniture details");
				}
				const data = await response.json();
				console.log(data); // Log the data to see the response

				// Assuming the furniture array is under the 'furnitures' key
				if (data.furnitures && Array.isArray(data.furnitures)) {
					setFurnitureData(data.furnitures); // Set state to the array of furnitures
				} else {
					throw new Error("Data does not contain a valid array of furnitures");
				}
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchFurniture();
	}, []);

	if (loading) return <div className="text-center">Loading...</div>;
	if (error) return <div className="text-red-500 text-center">{error}</div>;

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-4">Furniture Collection</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{furnitureData.map((furniture) => (
					<ProductCard
						key={furniture._id} // Ensure this id is unique for each furniture item
						id={furniture._id}
						images={furniture.images}
						name={furniture.name}
						price={`$${furniture.price}`} // Format price as needed
						description={furniture.description}
						showViewDetails={true}
						showAddToCart={false}
						showUpdateButton={true}
					/>
				))}
			</div>
		</div>
	);
}

export default ViewProduct;