import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({
	id,
	images,
	name,
	price,
	description,
	showAddToCart,
	showUpdateButton,
	showArchiveButton,
	showUnArchivedButton,
	onArchiveSuccess,
	onUnArchiveSuccess
}) => {
	// Function to truncate the description
	const truncateDescription = (desc, maxLength) => {
		if (desc.length > maxLength) {
			return `${desc.substring(0, maxLength)}...`;
		}
		return desc;
	};
	const maxDescriptionLength = 60; // Set the max length for the description

	// Function to handle archiving the item
	const archiveItem = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(
				`http://localhost:3000/api/furnitures/archive/${id}`,
				{
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				}
			);
			const data = await response.json();
			if (!data.ok) {
				alert(data.error);
			} else {
				alert(data.success);
				onArchiveSuccess(); // Trigger update in parent component
			}
		} catch (error) {
			console.error("Error archiving item:", error);
			alert("Error archiving item. Please try again.");
		}
	};

	// Function to handle unarchiving the item
	const unarchiveItem = async (e) => {
		e.preventDefault(); // Prevents navigating when clicking the button
		try {
			const response = await fetch(
				`http://localhost:3000/api/furnitures/unarchive/${id}`,
				{
					method: "POST", // Assuming POST for unarchiving
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			);
			const data = await response.json();
			if (!data.ok) {
				alert(data.error);
			} else {
				alert(data.success);
				onUnArchiveSuccess();
			}
		} catch (error) {
			console.error("Error unarchiving item:", error);
			alert("Error unarchiving item. Please try again.");
		}
	};

	return (
		<Link
			to={`/furnitures/${id}`}
			className="bg-white border-2 rounded-md shadow-lg transition-transform transform hover:scale-105 p-6 flex flex-col justify-between w-auto"
		>
			{/* Render only the first image from the images array */}
			{images && images.length > 0 && (
				<img
					src={`data:image/jpeg;base64,${images[0]}`} // Accessing the first image
					alt={name}
					className="w-full h-40 object-contain rounded-md mb-4"
				/>
			)}
			<div className="flex-grow">
				<h3 className="text-xl font-bold text-gray-800">{name}</h3>
				<p className="mt-2 text-lg text-green-600">₱ {price}</p>
				<p className="mt-2 text-gray-500">
					{truncateDescription(description, maxDescriptionLength)}
				</p>
			</div>
			<div className="mt-4 flex flex-col">
				{showAddToCart && (
					<Link
						to={`/direct-order/${id}`}
						className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors duration-300 text-center w-full"
					>
						Buy
					</Link>
				)}
				{showUpdateButton && (
					<Link
						to={`/furnitures/edit/${id}`}
						onClick={(e) => e.stopPropagation()} // Prevent card click navigation
						className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors duration-300 text-center"
					>
						Update Furniture
					</Link>
				)}
				{showArchiveButton && (
					<button
						onClick={archiveItem}
						className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition-colors duration-300 mt-2"
					>
						Archive
					</button>
				)}
				{showUnArchivedButton && (
					<button
						onClick={unarchiveItem}
						className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors duration-300 mt-2"
					>
						Unarchive
					</button>
				)}
			</div>
		</Link>
	);
};

export default ProductCard;
