import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MdOutlineArchive } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

function ProductDetails() {
	const { id } = useParams();
	const [furnitureData, setFurnitureData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchFurnitureDetails = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/api/furnitures/${id}`
				);
				if (!response.ok) {
					throw new Error("Failed to fetch furniture details");
				}
				const data = await response.json();
				console.log("Data fetched:", data);

				if (data) {
					setFurnitureData(data);
				} else {
					throw new Error("Furniture data not found");
				}
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchFurnitureDetails();
	}, [id]);

	if (loading) return <div className="text-center">Loading...</div>;
	if (error) return <div className="text-red-500 text-center">{error}</div>;
	if (!furnitureData)
		return <div className="text-center">No furniture found</div>;

	console.log("Furniture Data:", furnitureData);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="max-w-7xl w-full min-h-[700px] mx-auto bg-white rounded-lg shadow-lg p-12">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
					{/* Left side - Image and Back Button */}
					<div className="space-y-6">
						<div className="aspect-square w-full border rounded-lg overflow-hidden">
							<img
								src={`data:image/jpeg;base64,${furnitureData.image}`}
								alt={furnitureData.name}
								className="w-full h-full object-cover"
							/>
						</div>
						<Link
							to="/dashboard"
							className="inline-block bg-green-100 hover:bg-green-200 text-green-700 px-6 py-3 rounded-md transition-colors duration-300"
						>
							Go back
						</Link>
					</div>

					{/* Right side - Product Details */}
					<div className="bg-slate-100 p-6 rounded-lg flex flex-col h-full">
						<div className="flex-grow space-y-8">
							<div>
								<h1 className="text-3xl font-bold text-gray-900">
									{furnitureData.name}
								</h1>
								<p className="mt-4 text-gray-600">
									{furnitureData.description}
								</p>
							</div>

							{/* Product Specifications Table */}
							<table className="w-full table-auto border-collapse border border-gray-300 shadow-sm">
								<thead className="bg-green-100">
									<tr>
										<th className="border px-6 py-3 font-semibold text-left text-green-700">
											Specification
										</th>
										<th className="border px-6 py-3 font-semibold text-left text-green-700">
											Details
										</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className="border px-6 py-3 font-semibold text-gray-700">
											Price
										</td>
										<td className="border px-6 py-3 text-green-600">
											<strong>PHP</strong>
											{furnitureData.price}
										</td>
									</tr>
									<tr>
										<td className="border px-6 py-3 font-semibold text-gray-700">
											Colors
										</td>
										<td className="border px-6 py-3 flex items-center space-x-2">
											{furnitureData.colors &&
											furnitureData.colors.length > 0 ? (
												furnitureData.colors.map((color) => (
													<div
														key={`${color.id}-${color.name}`}
														className="flex items-center"
													>
														<div
															className="w-6 h-6 rounded-full"
															style={{ backgroundColor: color.rgb }}
															title={color.name}
														/>
														<span className="ml-2 text-gray-700">
															{color.name}
														</span>
													</div>
												))
											) : (
												<span className="text-gray-600">
													No colors available
												</span>
											)}
										</td>
									</tr>
									<tr>
										<td className="border px-6 py-3 font-semibold text-gray-700">
											Materials
										</td>
										<td className="border px-6 py-3">
											{furnitureData.materials
												.map((material) => material.name)
												.join(", ")}
										</td>
									</tr>
									<tr>
										<td className="border px-6 py-3 font-semibold text-gray-700">
											Sizes
										</td>
										<td className="border px-6 py-3">
											{furnitureData.sizes.map((size) => size.label).join(", ")}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="mt-8 flex justify-between space-x-6">
							<button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors duration-300 flex items-center justify-center">
								<MdOutlineArchive className="mr-2 text-white" />{" "}
								{/* Archive icon color */}
								Archive
							</button>
							<Link
								to={`/furnitures/edit/${furnitureData._id}`}
								className="w-full text-center bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-md transition-colors duration-300 flex items-center justify-center"
							>
								<FaRegEdit className="mr-2 text-white" />{" "}
								{/* Edit icon color */}
								Edit
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProductDetails;
