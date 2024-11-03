import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notification = () => {
	const [notification, setNotification] = useState({
		requests: [],
		orders: [],
	});
	const [isOpen, setIsOpen] = useState(false);

	const toggleNotification = () => {
		setIsOpen(!isOpen);
	};

	const fetchNotifications = async () => {
		try {
			const [requestsResponse, ordersResponse] = await Promise.all([
				fetch("http://localhost:3000/api/admin/notifications/pending-request", {
					method: "GET",
					credentials: "include",
				}),
				fetch("http://localhost:3000/api/admin/notifications/pending-orders", {
					method: "GET",
					credentials: "include",
				}),
			]);

			if (!requestsResponse.ok || !ordersResponse.ok) {
				throw new Error("Network response was not ok");
			}

			const requestsData = await requestsResponse.json();
			const ordersData = await ordersResponse.json();

			setNotification({
				requests: requestsData.length > 0 ? requestsData : [],
				orders: ordersData.length > 0 ? ordersData : [],
			});
		} catch (error) {
			console.error("Error fetching notifications:", error);
		}
	};

	// Fetch notifications from the API
	useEffect(() => {
		fetchNotifications();
	}, []);

	// Function to accept admin request
	const acceptRequest = async (adminId) => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/admin/notifications/accept-request/${adminId}`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				throw new Error(response.error);
			}

			const result = await response.json();
			toast.success(result.message); // Show success toast notification

			// Optionally, remove the accepted notification from the UI
			setNotification((prev) => ({
				...prev,
				requests: prev.requests.filter((admin) => admin._id !== adminId),
			}));
		} catch (error) {
			console.error("Error accepting admin request:", error);
			toast.error("Error accepting request: " + error.message); // Show error toast notification
		}
	};

	const acceptOrder = async (orderId) => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/admin/notifications/accept-order/${orderId}`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				throw new Error("Failed to accept order");
			}

			const result = await response.json();
			toast.success(result.message); // Show success toast notification

			// Optionally, remove the accepted notification from the UI
			setNotification((prev) => ({
				...prev,
				orders: prev.orders.filter((order) => order._id !== orderId),
			}));
		} catch (error) {
			console.error("Error accepting order request:", error);
			toast.error("Error accepting order: " + error.message); // Show error toast notification
		}
	};

	const cancelOrder = async (orderId) => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/admin/notifications/cancel-order/${orderId}`,
				{
					method: "PUT",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				throw new Error("Failed to accept order");
			}

			const result = await response.json();
			toast.success(result.message); // Show success toast notification

			// Optionally, remove the accepted notification from the UI
			setNotification((prev) => ({
				...prev,
				orders: prev.orders.filter((order) => order._id !== orderId),
			}));
		} catch (error) {
			console.error("Error accepting order request:", error);
			toast.error("Error accepting order: " + error.message); // Show error toast notification
		}
	};

	return (
		<div className="relative">
			<button
				onClick={toggleNotification}
				className="relative p-2 focus:outline-none"
			>
				<FontAwesomeIcon icon={faBell} size="lg" />
				{/* Notification Badge */}
				{notification.requests.length > 0 || notification.orders.length > 0 ? (
					<span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
				) : null}
			</button>
			{isOpen && (
				<div className="absolute right-0 mt-2 w-[300px] bg-white shadow-lg rounded-lg p-4 z-50 max-h-[500px] overflow-y-auto">
					{notification.requests.length === 0 &&
						notification.orders.length === 0 && (
							<h4 className="font-bold mb-2 text-center text-gray-500">
								No notifications
							</h4>
						)}
					<ul className="text-sm">
						{notification.requests.map((admin, index) => (
							<li key={index} className="mb-4">
								<span>{admin.firstname} has a pending approval request.</span>
								<div className="mt-1">
									<button
										className="bg-green-500 text-white px-2 py-1 rounded mr-1"
										onClick={() => acceptRequest(admin._id)} // Pass the admin ID to the acceptRequest function
									>
										Accept
									</button>
									<button className="bg-red-500 text-white px-2 py-1 rounded">
										Reject
									</button>
								</div>
							</li>
						))}
					</ul>

					<ul className="text-sm">
						{notification.orders.map((order, index) => (
							<li key={index} className="mb-4">
								<span>Order #{order.orderNumber} has been place.</span>
								<div className="mt-1">
									<button
										className="bg-green-500 text-white px-2 py-1 rounded mr-1"
										onClick={() => acceptOrder(order._id)}
									>
										Accept
									</button>
									<button
										className="bg-red-500 text-white px-2 py-1 rounded"
										onClick={() => cancelOrder(order._id)}
									>
										Cancel
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>
			)}
			<ToastContainer />
		</div>
	);
};

export default Notification;
