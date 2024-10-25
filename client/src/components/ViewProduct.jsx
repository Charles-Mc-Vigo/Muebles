import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { PiArchiveDuotone, PiCaretRightBold, PiCaretLeftBold } from "react-icons/pi";

function ViewProduct() {
	const [furnitureData, setFurnitureData] = useState([]);
	const [archivedFurnitures, setArchivedFurnitures] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showArchived, setShowArchived] = useState(false);

	useEffect(() => {
		// Fetch active furniture
		const fetchFurniture = async () => {
			try {
				const response = await fetch(`http://localhost:3000/api/furnitures`, {
					method: "GET",
					credentials: "include",
				});
				if (!response.ok) {
					throw new Error("Failed to fetch furniture details");
				}
				const data = await response.json();
				setFurnitureData(data);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		// Fetch archived furniture
		const fetchArchivedFurnitures = async () => {
			try {
				const response = await fetch(`http://localhost:3000/api/furnitures/archived`, {
					method: "GET",
					credentials: "include",
				});
				if (!response.ok) {
					throw new Error("Failed to fetch archived furniture");
				}
				const data = await response.json();
				setArchivedFurnitures(data);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchFurniture();
		fetchArchivedFurnitures();
	}, []);

	// Handle showing archived furniture when the button is clicked
	const toggleArchivedView = () => {
		setShowArchived(!showArchived);
	};

	if (loading) return <div className="text-center">Loading...</div>;
	if (error) return <div className="text-red-500 text-center">{error}</div>;

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Page Title */}
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold">
					{showArchived ? "Archived Furniture" : "Active Furniture"}
				</h1>
				{/* Toggle Button */}
				<button
					className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md transition-all hover:bg-blue-600 focus:outline-none"
					onClick={toggleArchivedView}
				>
					{showArchived ? (
						<>
							<PiCaretLeftBold className="mr-2" size={20} />
							Show Active
						</>
					) : (
						<>
							<PiArchiveDuotone className="mr-2" size={20} />
							Show Archived
						</>
					)}
				</button>
			</div>

			{/* Conditionally render archived or active furniture */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 transition-opacity">
				{showArchived
					? archivedFurnitures.length > 0 ? (
							archivedFurnitures.map((furniture) => (
								<ProductCard
									key={furniture._id}
									id={furniture._id}
									images={furniture.images}
									name={furniture.name}
									price={`Php ${furniture.price}`}
									description={furniture.description}
									showViewDetails={true}
									showUnArchivedButton={true}
								/>
							))
					  ) : (
							<p className="text-center text-gray-500 col-span-full">
								No archived furniture available.
							</p>
					  )
					: furnitureData.length > 0 ? (
							furnitureData.map((furniture) => (
								<ProductCard
									key={furniture._id}
									id={furniture._id}
									images={furniture.images}
									name={furniture.name}
									price={`Php ${furniture.price}`}
									description={furniture.description}
									showViewDetails={true}
									showUpdateButton={true}
									showArchiveButton={true}
								/>
							))
					  ) : (
							<p className="text-center text-gray-500 col-span-full">
								No active furniture available.
							</p>
					  )}
			</div>
		</div>
	);
}

export default ViewProduct;
