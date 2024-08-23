import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductManagement = () => {
	const [products, setProducts] = useState([]);
	const [newProduct, setNewProduct] = useState({
		image: null,
		category: "",
		furnitureType: "",
		description: "",
		price: "",
	});

	const fetchProducts = async () => {
		try {
			const response = await axios.get("http://localhost:3000/api/furnitures");
			setProducts(response.data);
		} catch (error) {
			console.error("Error fetching products:", error);
			alert("Failed to fetch products. Please try again.");
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	const handleInputChange = (e) => {
		const { name, value, files } = e.target;
		setNewProduct((prevData) => ({
			...prevData,
			[name]: files ? files[0] : value,
		}));
	};

	const handleDelete = async (id) => {
		console.log("Deleting product with ID:", id); //for debugging
		try {
			await axios.delete(
				`http://localhost:3000/api/furnitures/furniture/${id}`
			);
			setProducts(products.filter((product) => product._id !== id));
			alert("Product deleted successfully.");
		} catch (error) {
			console.error("Error deleting product:", error);
			alert("Failed to delete the product. Please try again.");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const form = new FormData();
		form.append("image", newProduct.image);
		form.append("category", newProduct.category);
		form.append("furnitureType", newProduct.furnitureType);
		form.append("description", newProduct.description);
		form.append("price", newProduct.price);

		try {
			const response = await axios.post(
				"http://localhost:3000/api/furnitures/add-furniture",
				form,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			// console.log(response);
			fetchProducts(); // Refetch products after adding a new one
			setNewProduct({
				image: null,
				category: "",
				furnitureType: "",
				description: "",
				price: "",
			});
		} catch (error) {
			console.error(
				"Error creating furniture!",
				error.response?.data || error.message
			);
			alert(
				error.response?.data?.message ||
					error.message ||
					"Can not add furniture!"
			);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Product Management</h1>
			<div className="flex flex-col md:flex-row gap-4">
				{/* Product Form */}
				<div className="w-full md:w-1/3 bg-white p-4 rounded shadow">
					<form onSubmit={handleSubmit} className="space-y-4">
						<input
							type="file"
							name="image"
							id="image"
							onChange={handleInputChange}
						/>
						,
						<input
							type="text"
							name="category"
							placeholder="Category"
							value={newProduct.category}
							onChange={handleInputChange}
							className="w-full p-2 border rounded"
						/>
						<input
							type="text"
							name="furnitureType"
							placeholder="Type"
							value={newProduct.furnitureType}
							onChange={handleInputChange}
							className="w-full p-2 border rounded"
						/>
						<textarea
							name="description"
							placeholder="Description"
							value={newProduct.description}
							onChange={handleInputChange}
							className="w-full p-2 border rounded"
							rows="3"
						/>
						<input
							type="number"
							name="price"
							placeholder="Price"
							value={newProduct.price}
							onChange={handleInputChange}
							className="w-full p-2 border rounded"
						/>
						<button
							type="submit"
							className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
						>
							Submit
						</button>
					</form>
				</div>

				{/* Product Table */}
				<div className="w-full md:w-2/3">
					<div className="overflow-x-auto">
						<table className="w-full bg-white shadow rounded">
							<thead className="bg-gray-50">
								<tr>
									<th className="p-2 text-left">Image</th>
									<th className="p-2 text-left">Category</th>
									<th className="p-2 text-left">Type</th>
									<th className="p-2 text-left">Description</th>
									<th className="p-2 text-left">Price</th>
									<th className="p-2 text-left">Action</th>
								</tr>
							</thead>
							<tbody>
								{products.map((product, index) => (
									<tr key={product._id} className="border-t">
										<td className="p-2">
											{product.image && (
												<img
													src={`data:image/jpeg;base64,${product.image}`}
													alt={product.furnitureType}
													className="w-20 h-20 object-cover"
												/>
											)}
										</td>
										<td className="p-2">{product.category}</td>
										<td className="p-2">{product.furnitureType}</td>
										<td className="p-2">{product.description}</td>
										<td className="p-2">
											<strong>PHP</strong>
											<span className="px-2"></span> {product.price}
										</td>
										<td className="p-2">
											<button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600">
												Edit
											</button>
											<button
												onClick={() => handleDelete(product._id)}
												className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
											>
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductManagement;
