import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const RatingComponent = () => {
	const { orderId } = useParams();
	const navigate = useNavigate();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [rating, setRating] = useState(0);
	const [review, setReview] = useState("");
	const [submissionStatus, setSubmissionStatus] = useState(null);
	const [hoverRating, setHoverRating] = useState(0);
	const [furnitureId, setFurnitureId] = useState(null); // State for furnitureId

	const fetchOrder = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(
				`http://localhost:3000/api/orders/details/${orderId}`,
				{
					method: "GET",
					credentials: "include",
				}
			);
			if (!response.ok) {
				throw new Error("Could not fetch order details");
			}
			const orderData = await response.json();
			setOrder(orderData);
			// Set furnitureId based on order type
			if (orderData.type === "Pre-Order") {
				setFurnitureId(orderData.furniture._id); // Assuming furniture object has an id
			} else {
				setFurnitureId(orderData.items[0]?.furniture._id); // Assuming items is an array
			}

			// console.log(orderData.order)
		} catch (error) {
			setError(error.message);
			console.error("Error fetching order", error);
		} finally {
			setLoading(false);
		}
	};
  console.log("Furniture Id:", furnitureId);

	useEffect(() => {
		fetchOrder();
	}, [orderId]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Validate input
		if (rating === 0) {
			setSubmissionStatus({
				type: "error",
				message: "Please select a rating before submitting.",
			});
			return;
		}
		const ratingData = {
			rating,
			review: review.trim(),
		};

		console.log(ratingData)
		try {
			const response = await fetch(
				`http://localhost:3000/api/ratings/${furnitureId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(ratingData),
				}
			);
			if (!response.ok) {
				throw new Error("Failed to submit rating");
			}
			setSubmissionStatus({
				type: "success",
				message: "Thank you for your feedback!",
			});
			// Reset form after successful submission
			setTimeout(() => {
				setRating(0);
				setReview("");
				setSubmissionStatus(null);
				navigate(-1); // Optional: redirect after submission
			}, 2000);
		} catch (error) {
			setSubmissionStatus({
				type: "error",
				message:
					error.message || "An error occurred while submitting your review.",
			});
			console.error("Error submitting rating", error);
		}
	};
	// Loading State Component
	const LoadingState = () => (
		<div className="fixed inset-0 bg-gray-100 flex flex-col items-center justify-center z-50">
			<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
			<p className="mt-4 text-gray-600 text-lg">Loading order details...</p>
		</div>
	);

	// Error State Component
	const ErrorState = () => (
		<div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
			<div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
				<AlertTriangle className="mx-auto mb-4 text-red-500" size={64} />
				<h2 className="text-2xl font-bold text-red-600 mb-4">
					Oops! Something went wrong
				</h2>
				<p className="text-gray-600 mb-6">{error}</p>
				<button
					onClick={fetchOrder}
					className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
				>
					Try Again
				</button>
			</div>
		</div>
	);

	// Submission Status Component
	const SubmissionStatusMessage = () => {
		if (!submissionStatus) return null;
		const isSuccess = submissionStatus.type === "success";
		const Icon = isSuccess ? CheckCircle : XCircle;
		return (
			<div
				className={`fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 ${
					isSuccess ? "bg-green-100" : "bg-red-100"
				}`}
			>
				<div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
					<Icon
						className={`mx-auto mb-4 ${
							isSuccess ? "text-green-500" : "text-red-500"
						}`}
						size={64}
					/>
					<p
						className={`text-lg font-semibold ${
							isSuccess ? "text-green-600" : "text-red-600"
						}`}
					>
						{submissionStatus.message}
					</p>
				</div>
			</div>
		);
	};

	// Render star rating with hover effect
	const StarRating = () => (
		<div className="flex items-center mb-4">
			{[1, 2, 3, 4, 5].map((star) => (
				<button
					key={star}
					type="button"
					onMouseEnter={() => setHoverRating(star)}
					onMouseLeave={() => setHoverRating(0)}
					onClick={() => setRating(star)}
					className="transition-colors duration-200 ease-in-out"
					aria-label={`Rate ${star} out of 5 stars`}
				>
					<Star
						size={32}
						fill={(hoverRating || rating) >= star ? "#FFC107" : "none"}
						stroke="#FFC107"
						className="mx-1 cursor-pointer"
					/>
				</button>
			))}
			{rating > 0 && (
				<span className="ml-4 text-gray-600">{rating} / 5 stars</span>
			)}
		</div>
	);

	// If still loading
	if (loading) return <LoadingState />;
	// If there's an error
	if (error) return <ErrorState />;
	// If no order found
	if (!order) return <div className="text-center py-10">No order found.</div>;

	// Determine the furniture (works for both Pre-Order and regular order types)
	const furniture =
		order.type === "Pre-Order" ? order.furniture : order.items[0]?.furniture;

	return (
		<>
    <Header isLogin={true}/>
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
				<SubmissionStatusMessage />
				<div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden">
					{/* Order Details Section */}
					<div className="bg-gray-100 p-6 border-b border-gray-200">
						<h1 className="text-3xl font-bold text-gray-800 mb-4">
							Rate Your Order
						</h1>
						<div className="flex md:flex-row flex-col gap-4">
							{/* First Column - Furniture Image */}
							<div className="flex-1 flex items-center justify-center h-64 bg-gray-200">
								{furniture.images && furniture.images.length > 0 && (
									<img
										src={`data:image/jpeg;base64,${furniture.images[0]}`}
										alt={furniture.name}
										className="max-h-full max-w-full object-cover rounded-lg shadow-md"
									/>
								)}
							</div>
							{/* Second Column - Furniture Details */}
							<div className="flex-1 flex flex-col justify-between p-4">
								<h3 className="font-semibold text-gray-700 mb-2">
									Furniture Details
								</h3>
								<div className="bg-white rounded-lg shadow p-4 flex-grow space-y-3">
									<div className="space-y-2">
										<h4 className="text-xl font-bold text-gray-800">
											{furniture.name}
										</h4>
										<div className="flex items-center text-gray-600">
											<Info size={16} className="mr-2 text-blue-500" />
											<p className="text-sm">
												{furniture.description || "No description available"}
											</p>
										</div>
										<div className="flex items-center justify-between mt-2">
											<span className="text-lg font-semibold text-green-600">
												PHP {furniture.price.toLocaleString()}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/* Rating Form */}
					<form onSubmit={handleSubmit} className="p-6">
						<h2 className="text-2xl font-bold text-gray-800 mb-4">
							Share Your Experience
						</h2>
						<div className="mb-6">
							<label className="block text-gray-700 font-medium mb-2">
								Your Rating
							</label>
							<StarRating />
						</div>
						<div className="mb-6">
							<label
								htmlFor="review"
								className="block text-gray-700 font-medium mb-2"
							>
								Your Review
							</label>
							<textarea
								id="review"
								value={review}
								onChange={(e) => setReview(e.target.value)}
								placeholder="Tell us about your experience (optional)"
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
								rows="4"
								maxLength={500}
							/>
							<p className="text-right text-sm text-gray-500 mt-1">
								{review.length}/500 characters
							</p>
						</div>
						<button
							type="submit"
							disabled={rating === 0}
							className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 
                            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
						>
							<Star size={20} />
							<span>Submit Rating</span>
						</button>
					</form>
				</div>
			</div>
      <Footer/>
		</>
	);
};

export default RatingComponent;
