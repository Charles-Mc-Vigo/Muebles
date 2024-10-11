import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({
	id,
	image,
	name,
	price,
	description,
	showAddToCart,
	showViewDetails,
	showUpdateButton,
}) => {
	// Function to truncate the description
	const truncateDescription = (desc, maxLength) => {
		if (desc.length > maxLength) {
			return `${desc.substring(0, maxLength)}...`;
		}
		return desc;
	};

	const maxDescriptionLength = 100; // Set the max length for the description

	return (
		<div className="bg-white rounded-md shadow-lg transition-transform transform hover:scale-105 p-6 flex flex-col justify-between w-auto">
			<img
				src={`data:image/jpeg;base64,${image}`}
				alt={name}
				className="w-full h-40 object-contain rounded-md mb-4"
			/>
			<div className="flex-grow">
				<h3 className="text-xl font-bold text-gray-800">{name}</h3>
				<p className="mt-2 text-lg text-green-600">{price}</p>
				<p className="mt-2 text-gray-500">
					{truncateDescription(description, maxDescriptionLength)}
				</p>
			</div>
			<div className="mt-4 flex flex-col">
				{showViewDetails && (
					<Link
						to={`/furnitures/${id}`}
						className="text-right mr-5 text-green-600 hover:underline mb-2"
					>
						View Product Details
					</Link>
				)}
				{showAddToCart && (
					<button className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors duration-300">
						Add Set to Cart
					</button>
				)}

				{showUpdateButton && (
					<Link
						to={`/furnitures/edit/${id}`}
						className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors duration-300 text-center"
					>
						Update Furniture
					</Link>
				)}
			</div>
		</div>
	);
};

export default ProductCard;