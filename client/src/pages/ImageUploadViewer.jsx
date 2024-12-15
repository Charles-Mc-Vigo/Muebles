import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TbArrowsExchange2 } from "react-icons/tb";

const ImageUploadViewer = () => {
	const { orderId } = useParams();
	const navigate = useNavigate();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/api/orders/uploaded-images-orders/${orderId}`,
					{
						method: "GET",
						credentials: "include",
					}
				);
				if (!response.ok) {
					throw new Error("Failed to fetch order details");
				}
				const data = await response.json();
				setOrder(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchOrder();
	}, [orderId]);

	if (loading) return <p>Loading order details...</p>;
	if (error) return <p>Error: {error}</p>;
	if (!order) return <p>Order not found.</p>;

	return (
		<div className="p-8">
			<div className="p-6 bg-white rounded shadow-md">
				<h1 className="text-3xl font-bold mb-6">Order Details</h1>
				<h2 className="text-2xl font-semibold mb-4">
					Order #{order.orderNumber}
				</h2>
				<p className="tracking-wide font-light p-2">
					{order.user?.firstname || "N/A"}
					{order.user?.lastname || "N/A"}
					{order.user?.addresses && order.user.addresses.length > 0 ? (
						order.user.addresses
							.filter((address) => address.isDefault)
							.map((defaultAddress, index) => (
								<p key={index} className="tracking-wide font-light p-2">
									{defaultAddress.streetAddress}, {defaultAddress.barangay},{" "}
									{defaultAddress.municipality}, {defaultAddress.zipCode}
								</p>
							))
					) : (
						<p>No addresses available</p>
					)}
				</p>
				<p className="tracking-wide font-light p-2">
					{order.user?.email || "N/A"}
				</p>
				<p className="tracking-wide font-light p-2">{order.user?.phoneNumber || "N/A"}</p>
				<p className="mb-4"></p>
			</div>
			<div className="p-6 bg-white rounded shadow-md">
				<h3 className="text-xl font-semibold mb-2">Uploaded Designs</h3>
				{order.designImages && order.designImages.length > 0 ? (
					<div className="grid grid-cols-2 gap-4">
						{order.designImages.map((image, index) => (
							<img
								key={index}
								src={`data:image/jpeg;base64,${image}`}
								alt={`Design for Order #${order.orderNumber} - Image ${
									index + 1
								}`}
								className="w-auto h-auto object-cover rounded-lg shadow-sm"
							/>
						))}
					</div>
				) : (
					<p>No design uploaded</p>
				)}
			</div>
		</div>
	);
};

export default ImageUploadViewer;
