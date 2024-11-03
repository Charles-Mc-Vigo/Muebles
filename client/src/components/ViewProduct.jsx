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
	const [showArchivedCategories, setShowArchivedCategories] = useState(false); // New state for categories
	const [showDropdown, setShowDropdown] = useState(false);

	const fetchFurniture = async () => {
		try {
			const response = await fetch(`http://localhost:3000/api/furnitures`, {
				method: "GET",
				credentials: "include",
			});
			const data = await response.json();
			setFurnitureData(data || []);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const fetchArchivedFurnitures = async () => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/furnitures/archived`,
				{
					method: "GET",
					credentials: "include",
				}
			);
			const data = await response.json();
			setArchivedFurnitures(data || []);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const fetchArchivedCategories = async () => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/categories/archived`,
				{
					method: "GET",
					credentials: "include",
				}
			);
			const data = await response.json();
			setArchivedCategories(data || []);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFurniture();
		fetchArchivedFurnitures();
		fetchArchivedCategories();
	}, []);

	// Function to refresh the furniture list
	const refreshFurnitureList = () => {
		fetchFurniture();
	};

	const refreshArchiveFurnitureList = () => {
		fetchArchivedFurnitures();
	};

	const toggleDropdown = () => {
		setShowDropdown(!showDropdown);
	};

	const showActiveFurniture = () => {
		setShowArchived(false);
		setShowArchivedCategories(false); // Reset to show active furniture
		setShowDropdown(false);
	};

	const showArchivedFurniture = () => {
		setShowArchived(true);
		setShowArchivedCategories(false); // Ensure only archived furniture shows
		setShowDropdown(false);
	};

	const showArchivedCategoryList = () => {
		setShowArchived(false);
		setShowArchivedCategories(true); // Show archived categories only
		setShowDropdown(false);
	};

	const unarchiveCategory = async (categoryId) => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/categories/unarchive/${categoryId}`,
				{
					method: "POST",
					credentials: "include",
				}
			);
			const data = await response.json();
			toast.success(data.success);
			setArchivedCategories(
				archivedCategories.filter((category) => category._id !== categoryId)
			);
			// Refresh the archived categories after unarchiving
			await fetchArchivedCategories();
		} catch (error) {
			setError(error.message);
		}
	};

	if (loading) return <div className="text-center">Loading...</div>;
	if (error) return <div className="text-red-500 text-center">{error}</div>;

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold">
					{showArchived
						? "Archived Furniture"
						: showArchivedCategories
						? "Archived Categories"
						: "Active Furniture"}
				</h1>
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
									onClick={showActiveFurniture}
								>
									Active Furniture
								</li>
								<li
									className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
									onClick={showArchivedFurniture}
								>
									Archived Furniture
								</li>
								<li
									className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
									onClick={showArchivedCategoryList}
								>
									Archived Categories
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>
			{showArchived ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 transition-opacity">
					{Array.isArray(archivedFurnitures) &&
					archivedFurnitures.length > 0 ? (
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
								onUnArchiveSuccess={refreshArchiveFurnitureList} // Refresh the archived furniture list
							/>
						))
					) : (
						<p className="text-center text-gray-500 col-span-full">
							No archived furniture available.
						</p>
					)}
				</div>
			) : showArchivedCategories ? (
				<table className="min-w-full bg-white">
					<thead>
						<tr>
							<th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
								Category Name
							</th>
							<th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{Array.isArray(archivedCategories) &&
						archivedCategories.length > 0 ? (
							archivedCategories.map((category) => (
								<tr key={category._id}>
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
							))
						) : (
							<tr>
								<td
									className="text-center text-gray-500 col-span-full"
									colSpan={2}
								>
									No archived categories available.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 transition-opacity">
					{Array.isArray(furnitureData) && furnitureData.length > 0 ? (
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
								onArchiveSuccess={refreshFurnitureList} // Refresh the active furniture list
							/>
						))
					) : (
						<p className="text-center text-gray-500 col-span-full">
							No active furniture available.
						</p>
					)}
				</div>
			)}
			<ToastContainer />
		</div>
	);
}

export default ViewProduct;
