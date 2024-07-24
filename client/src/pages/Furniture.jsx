import React, { useState } from "react";

export default function Furniture() {
	const [formData, setFormData] = useState({
		image: "",
		category: "",
		furnitureType: "",
		description: "",
		price: "",
	});

  const [image, setImage] = useState(null);


	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});

    console.log(formData)
	};

  const handleImageChange = (e) => {
    setImage(e.target.files[0])
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("image", image);
    data.append("category", formData.category);
    data.append("furnitureType", formData.furnitureType);
    data.append("description", formData.description);
    data.append("price", formData.price);

    console.log(formData)
  }


	return (
		<form onSubmit={handleSubmit} className="flex flex-col bg-slate-500 text-center items-center gap-5 h-screen justify-center">
			<input onChange={handleImageChange} type="file" accept=".png, .jpeg, .jpg" required id="image" />
			<input
				className="rounded-md p-2"
				type="text"
				required
				id="category"
				placeholder="Category"
        onChange={handleChange}
			/>
			<input
				className="rounded-md p-2"
				type="text"
				required
				id="furnitureType"
				placeholder="Furniture Type"
        onChange={handleChange}

			/>
			<input
				className="rounded-md p-2"
				type="text"
				required
				id="description"
				placeholder="Description"
        onChange={handleChange}

			/>
			<input
				className="rounded-md p-2"
				type="number"
				required
				id="price"
				placeholder="Price"
        onChange={handleChange}

			/>
			<button
				type="submit"
				className="rounded-md p-2 bg-slate-700 text-white py-2 px-6"
			>
				Submit
			</button>
		</form>
	);
}
