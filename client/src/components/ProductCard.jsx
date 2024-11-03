import React from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
	onUnArchiveSuccess,
}) => {
	// Function to truncate the description
	const truncateDescription = (desc, maxLength) => {
		return desc.length > maxLength
			? `${desc.substring(0, maxLength)}...`
			: desc;
	};

	const maxDescriptionLength = 60;

	const archiveItem = async (e) => {
		e.stopPropagation();
		if (!window.confirm("Are you sure you want to archive this item?")) return;

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
			toast.success(data.success);
			onArchiveSuccess();
		} catch (error) {
			toast.error("Error archiving item. Please try again.");
		}
	};

	const unarchiveItem = async (e) => {
		e.stopPropagation();
		if (!window.confirm("Are you sure you want to unarchive this item?"))
			return;

		try {
			const response = await fetch(
				`http://localhost:3000/api/furnitures/unarchive/${id}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				}
			);
			const data = await response.json();
			toast.success(data.success);
			onUnArchiveSuccess();
		} catch (error) {
			toast.error("Error unarchiving item. Please try again.");
		}
	};

	return (
		<div className="bg-white border-2 rounded-md shadow-lg transition-transform transform hover:scale-105 p-6 flex flex-col justify-between w-auto">
			<Link to={`/furnitures/${id}`} className="flex-grow">
				{images && images.length > 0 && (
					<img
						src={`data:image/jpeg;base64,${images[0]}`}
						alt={name}
						className="w-full h-40 object-contain rounded-md mb-4"
					/>
				)}
				<div>
					<h3 className="text-xl font-bold text-gray-800">{name}</h3>
					<p className="mt-2 text-lg text-green-600">₱ {price}</p>
					<p className="mt-2 text-gray-500">
						{truncateDescription(description, maxDescriptionLength)}
					</p>
				</div>
			</Link>
			<div className="mt-4 flex flex-col">
				{showAddToCart && (
					<button
						onClick={(e) => e.stopPropagation()}
						disabled
						className="bg-gray-400 text-white py-2 rounded-md transition-colors duration-300 text-center w-full cursor-not-allowed"
					>
						Buy (Unavailable)
					</button>
				)}
				{showUpdateButton && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							window.location.href = `/furnitures/edit/${id}`;
						}}
						className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors duration-300 text-center mt-2"
					>
						Update Furniture
					</button>
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
			<ToastContainer />
		</div>
	);
};

export default ProductCard;
