import axios from "axios";
import React, { useState } from "react";
import Resizer from "react-image-file-resizer";
import { Navigate, useNavigate } from "react-router-dom";

export default function Furnitures() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		category: "",
		furnitureType: "",
		description: "",
		price: "",
		image: "",
	});

  const navigate = useNavigate();

	const compressImage = (file) =>
		new Promise((resolve) => {
			Resizer.imageFileResizer(
				file,
				800,
				800,
				"JPEG",
				70,
				0,
				(uri) => {
					resolve(uri);
				},
				"base64"
			);
		});

	const handleInputChange = (e) => {
		const { id, value } = e.target;
		setFormData({ ...formData, [id]: value });
	};

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		try {
			const compressedImage = await compressImage(file);
			setFormData({ ...formData, image: compressedImage });
		} catch (error) {
			console.error("Error compressing image:", error);
			setError("Error processing image. Please try a smaller file.");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);
		try {
			const token = localStorage.getItem("userToken");
      const isAuthenticated = localStorage.getItem("isAuthenticated", "true");
			const response = await axios.post(
				"http://localhost:3000/api/furnitures/create",
				formData,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
            "isAuthorized":"true"
					},
				}
			);
			console.log(response.data);
			alert("Furniture created successfully!");
		} catch (error) {
			console.error("Something went wrong!", error);
			if (error.response && error.response.status === 401) {
				setError("Unauthorized. Please log in first.");
        navigate('/login')
			} else {
				setError(
					error.response?.data?.message ||
						error.message ||
						"Error creating furniture"
				);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="h-screen flex bg-slate-400 items-center justify-center flex-col">
			<form className="flex flex-col gap-5 w-1/4" onSubmit={handleSubmit}>
				{formData.image && (
					<img
						width={200}
						height={200}
						src={formData.image}
						alt="Uploaded furniture"
					/>
				)}
				<input
					className="p-3 rounded-lg"
					type="file"
					accept="image/png, image/jpeg"
					id="image"
					onChange={handleImageUpload}
					required
				/>
				<input
					className="p-2 rounded-lg"
					type="text"
					id="category"
					value={formData.category}
					onChange={handleInputChange}
					placeholder="Category"
					required
				/>
				<input
					className="p-2 rounded-lg"
					type="text"
					id="furnitureType"
					value={formData.furnitureType}
					onChange={handleInputChange}
					placeholder="Furniture type"
					required
				/>
				<input
					className="p-2 rounded-lg"
					type="text"
					id="description"
					value={formData.description}
					onChange={handleInputChange}
					placeholder="Description"
					required
				/>
				<input
					className="p-2 rounded-lg"
					type="number"
					id="price"
					value={formData.price}
					onChange={handleInputChange}
					placeholder="Price"
					required
				/>
				<button
					type="submit"
					className="bg-slate-800 text-white font-semibold p-2 rounded-lg hover:opacity-80"
					disabled={isLoading}
				>
					{isLoading ? "Creating..." : "Create"}
				</button>
			</form>
		</div>
	);
}
