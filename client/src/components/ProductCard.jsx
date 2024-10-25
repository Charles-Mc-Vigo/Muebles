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
}) => {
	// Function to truncate the description
	const truncateDescription = (desc, maxLength) => {
		if (desc.length > maxLength) {
			return `${desc.substring(0, maxLength)}...`;
		}
		return desc;
	};
	const maxDescriptionLength = 60; // Set the max length for the description

	// Function to handle adding item to the cart
	const addToCart = async (e) => {
		e.preventDefault(); // Prevents navigating when clicking the button
		const item = {
			furnitureId: id,  // The server expects the ID of the furniture
			quantity: 1,  // Default quantity to 1
		};
		try {
			const response = await fetch('http://localhost:3000/api/cart', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(item),  // Send the furnitureId and quantity to the server
			});
			if (!response.ok) {
				throw new Error('Failed to add item to cart');
			}
			const data = await response.json();
			console.log('Item added to cart successfully:', data);  // Optionally handle success (e.g., show a toast or update cart state)
			alert('Item added to cart successfully!');
		} catch (error) {
			console.error('Error adding item to cart:', error);  // Optionally handle error (e.g., show an error message)
			alert('Error adding item to cart. Please try again.');
		}
	};

	// Function to handle archiving the item
	const archiveItem = async (e) => {
		e.preventDefault(); // Prevents navigating when clicking the button
		try {
			const response = await fetch(`http://localhost:3000/api/furnitures/${id}/archive`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});
			if (!response.ok) {
				throw new Error('Failed to archive item');
			}
			const data = await response.json();
			console.log('Item archived successfully:', data); // Optionally handle success
			alert('Item archived successfully!');
		} catch (error) {
			console.error('Error archiving item:', error); // Optionally handle error
			alert('Error archiving item. Please try again.');
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
					<button
						onClick={addToCart}
						className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors duration-300"
					>
						Add to Cart
					</button>
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
			</div>
		</Link>
	);
};

export default ProductCard;
