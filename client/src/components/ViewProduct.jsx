import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { PiArchiveDuotone } from "react-icons/pi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ViewProduct() {
	const [furnitureData, setFurnitureData] = useState([]);
	const [archivedFurnitures, setArchivedFurnitures] = useState([]);
	const [archivedCategories, setArchivedCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showArchived, setShowArchived] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);

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

		// Fetch archived categories
		const fetchArchivedCategories = async () => {
			try {
				const response = await fetch(`http://localhost:3000/api/categories/archived`, {
					method: "GET",
					credentials: "include",
				});
				if (!response.ok) {
					throw new Error("Failed to fetch archived categories");
				}
				const data = await response.json();
				setArchivedCategories(data);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchFurniture();
		fetchArchivedFurnitures();
		fetchArchivedCategories();
	}, []);

	// Toggle dropdown menu
	const toggleDropdown = () => {
		setShowDropdown(!showDropdown);
	};

	// Unarchive a category
	const unarchiveCategory = async (categoryId) => {
		try {
			const response = await fetch(`http://localhost:3000/api/categories/unarchive/${categoryId}`, {
				method: "POST",
				credentials: "include",
			});
			if (!response.ok) {
				throw new Error("Failed to unarchive category");
			}
			// Update the list after successful unarchiving
			toast.success("Category unarchived successfully!");
			setArchivedCategories(archivedCategories.filter(category => category._id !== categoryId));
		} catch (error) {
			setError(error.message);
		}
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
				<div className="relative">
					<button
						className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md transition-all hover:bg-blue-600 focus:outline-none"
						onClick={toggleDropdown}
					>
						<PiArchiveDuotone className="mr-2" size={20} />
						Archived Options
					</button>
					{showDropdown && (
						<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
							<ul className="py-1">
								<li
									className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
									onClick={() => setShowArchived(true)}
								>
									Furniture
								</li>
								<li className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
									Categories
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>

			{/* Display archived categories */}
			{showArchived ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 transition-opacity">
					{archivedFurnitures.length > 0 ? (
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
					)}
				</div>
			) : (
				// Categories Table
				<table className="min-w-full bg-white">
					<thead>
						<tr>
							<th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
								ID
							</th>
							<th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
								Category Name
							</th>
							<th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{archivedCategories.map((category) => (
							<tr key={category._id}>
								<td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
									{category._id}
								</td>
								<td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
									{category.name}
								</td>
								<td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
									<button
										className="bg-green-500 text-white px-4 py-2 rounded-md transition-all hover:bg-green-600 focus:outline-none"
										onClick={() => unarchiveCategory(category._id)}
									>
										Unarchive
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
			<ToastContainer/>
		</div>
	);
}

export default ViewProduct;
