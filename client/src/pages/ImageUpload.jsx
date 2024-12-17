import React, { useEffect, useState } from "react";

const ImageUpload = () => {
	const [images, setImages] = useState([]);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);
	const [userData, setUserData] = useState(null);
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [material, setMaterial] = useState(""); // Material state
	const [paymentMethod, setPaymentMethod] = useState("");
	const [quantity, setQuantity] = useState(1); // Default quantity is 1
	const [deliveryMode, setDeliveryMode] = useState(""); // Changed from deliveryOption to deliveryMode

	const handleImageChange = (event) => {
		const files = Array.from(event.target.files);
		const base64Images = [];
		const promises = files.map((file) => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					base64Images.push(reader.result.split(",")[1]);
					resolve();
				};
				reader.onerror = () => reject(new Error("File reading error"));
				reader.readAsDataURL(file);
			});
		});

		Promise.all(promises)
			.then(() => {
				setImages(base64Images);
				setError(null);
			})
			.catch((err) => {
				setError(err.message);
			});
	};

	

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await fetch("http://localhost:3000/api/users/data", {
					method: "GET",
					credentials: "include",
				});
				if (!response.ok) {
					throw new Error("Failed to fetch user data");
				}
				const data = await response.json();
				setUserData(data);
			} catch (error) {
				setError(error.message);
			}
		};

		fetchUserData();
	}, []);

	const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Validation checks for all fields
    if (!Array.isArray(images) || images.length === 0) {
        setError("At least one design image is required");
        setLoading(false);
        return;
    }

    if (!material) {
        setError("Please select a material");
        setLoading(false);
        return;
    }

    if (!paymentMethod) {
        setError("Please select a payment method");
        setLoading(false);
        return;
    }

    if (!deliveryMode) {
        setError("Please select a delivery mode");
        setLoading(false);
        return;
    }


    const formData = new FormData();
    formData.append("designImages", JSON.stringify(images));
    formData.append("userData", JSON.stringify(userData));
    formData.append("material", material);
    formData.append("paymentMethod", paymentMethod);
    formData.append("quantity", quantity); // Use the properly validated number
    formData.append("deliveryMode", deliveryMode);

    try {
        const response = await fetch(
            "http://localhost:3000/api/orders/upload-design-image/create",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    designImages: images,
                    userData,
                    material,
                    paymentMethod,
                    quantity,
                    deliveryMode,
                }),
            }
        );

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Error creating order");
        }

        setSuccessMessage(data.message);
        setSubmitted(true);
        setImages([]);
    } catch (error) {
        setError(error.message);
        console.error("Error uploading design images:", error);
    } finally {
        setLoading(false);
    }
};


// Increase quantity with a limit of 10
const increaseQuantity = () => {
  if (quantity < 10) {
    setQuantity(quantity + 1);
  }
};

// Decrease quantity with a minimum of 1
const decreaseQuantity = () => {
  if (quantity > 1) {
    setQuantity(quantity - 1);
  }
};


	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-lg mx-auto p-8 bg-white rounded-lg shadow-md">
				<h2 className="text-3xl font-bold mb-6 text-center">
					Upload Your Designs
				</h2>
				<form onSubmit={handleSubmit} className="space-y-6">
					<input
						type="file"
						accept="image/*"
						disabled={submitted}
						multiple
						onChange={handleImageChange}
						required
						className="block w-full text-lg text-gray-500 
						file:mr-4 file:py-3 file:px-4
						file:rounded-md file:border-0
						file:text-lg file:font-semibold
						file:bg-blue-500 file:text-white
						hover:file:bg-blue-600"
					/>

					<select
						value={material} // Material select
						onChange={(e) => setMaterial(e.target.value)} // Material state update
						required
						className="block w-full text-lg py-3 px-4 border rounded-md"
					>
						<option value="">Select Material</option>
						<option value="Narra">Narra</option>
						<option value="Acacia">Acacia</option>
						<option value="Mahogany">Mahogany</option>
					</select>

					<select
						value={paymentMethod}
						onChange={(e) => setPaymentMethod(e.target.value)}
						required
						className="block w-full text-lg py-3 px-4 border rounded-md"
					>
						<option value="">Select Payment Method</option>
						<option value="GCash">Gcash</option>
						<option value="Maya">Maya</option>
					</select>

					<div className="flex items-center justify-between">
						<button
							type="button"
							onClick={decreaseQuantity}
							className="text-lg text-gray-700 bg-gray-200 py-2 px-4 rounded-md"
						>
							-
						</button>
						<span className="text-lg font-semibold">{quantity}</span>
						<button
							type="button"
							onClick={increaseQuantity}
							className="text-lg text-gray-700 bg-gray-200 py-2 px-4 rounded-md"
						>
							+
						</button>
					</div>

					<select
						value={deliveryMode} // Delivery Mode select
						onChange={(e) => setDeliveryMode(e.target.value)} // Delivery Mode state update
						required
						className="block w-full text-lg py-3 px-4 border rounded-md"
					>
						<option value="">Select Delivery Mode</option>
						<option value="delivery">Delivery</option>
						<option value="pickup">Pick Up</option>
					</select>

					<button
						type="submit"
						disabled={submitted}
						className={`w-full py-3 px-4 text-white rounded-md text-lg transition duration-200 
						${
							submitted
								? "bg-gray-400 cursor-not-allowed"
								: "bg-blue-500 hover:bg-blue-600"
						}`}
					>
						{loading ? "Submitting..." : submitted ? "Submitted" : "Submit"}
					</button>
				</form>
				{error && <p className="mt-4 text-red-500 text-lg">{error}</p>}
				{successMessage && (
					<p className="mt-4 text-green-500 text-lg">{successMessage}</p>
				)}
			</div>
		</div>
	);
};

export default ImageUpload;
