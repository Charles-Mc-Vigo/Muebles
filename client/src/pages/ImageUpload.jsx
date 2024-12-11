import React, { useEffect, useState } from "react";

const ImageUpload = () => {
	const [images, setImages] = useState([]);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);
	const [userData, setUserData] = useState(null); // State to store user data
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleImageChange = (event) => {
		const files = Array.from(event.target.files);
		const base64Images = [];
		const promises = files.map((file) => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					base64Images.push(reader.result.split(",")[1]); // Store base64 string without the data URL prefix
					resolve();
				};
				reader.onerror = () => reject(new Error("File reading error"));
				reader.readAsDataURL(file);
			});
		});

		Promise.all(promises)
			.then(() => {
				setImages(base64Images); // Set the state with all base64 images
				setError(null); // Clear any previous error
			})
			.catch((err) => {
				setError(err.message);
			});
	};

	// Fetch user data on component mount
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
				setUserData(data); // Store user data in state
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
  
    if (!Array.isArray(images) || images.length === 0) {
      setError("At least one design image is required");
      setLoading(false);  // Reset loading state
      return;
    }
  
    console.log("Images being uploaded:", images);
  
    try {
      const response = await fetch(
        "http://localhost:3000/api/orders/upload-design-image/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ designImages: images, userData }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Error creating order");
      }
  
      setSuccessMessage(data.message);
      setSubmitted(true);
      setImages([]);  // Reset images after success
    } catch (error) {
      setError(error.message);
      console.error("Error uploading design images:", error);
    } finally {
      setLoading(false);  // Reset loading
    }
  };
  
  

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-lg mx-auto p-8 bg-white rounded-lg shadow-md">
				<div>
					<h2 className="text-3xl font-bold mb-6 text-center">
						Upload Your Designs
					</h2>
					<p className="m-5">
						Your custom design needs to be processed and may take 2-3 days.
					</p>
					<p className="m-5">
						Stay in touch for updates on your custom design.
					</p>
				</div>
				<form onSubmit={handleSubmit} className="space-y-6">
					<input
						type="file"
						accept="image/*"
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
