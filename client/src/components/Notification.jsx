import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast notifications
import { useNavigate } from "react-router-dom";

const Notification = () => {
	const [notification, setNotification] = useState({
		requests: [],
		orders: [],
	});
	const [isOpen, setIsOpen] = useState(false);
	const [fetchError, setFetchError] = useState(null); // New state for fetch error
	const navigate = useNavigate();

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
				// Instead of throwing an error, set the fetchError state
				setFetchError("Failed to fetch notifications. Please try again later.");
				return;
			}

			const requestsData = await requestsResponse.json();
			const ordersData = await ordersResponse.json();
			setNotification({
				requests: requestsData.length > 0 ? requestsData : [],
				orders: ordersData.length > 0 ? ordersData : [],
			});
			setFetchError(null); // Clear the error if fetch was successful
		} catch (error) {
			console.error("Error fetching notifications:", error);
			setFetchError("An error occurred while fetching notifications.");
		}
	};

	// Fetch notifications from the API
	useEffect(() => {
		fetchNotifications();
	}, []);

	const viewNewOrder = async (orderId) => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/admin/order/${orderId}`,
				{
					method: "GET",
					credentials: "include",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to view order");
			}
			navigate(`/order/${orderId}`);
		} catch (error) {
			console.error("Error in viewing the order: ", error);
			alert("Error viewing order: " + error.message); // Show error toast notification
		}
	};

	const viewRequest = async (adminId) => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/admin/notifications/pending-request/${adminId}`,
				{
					method: "GET",
					credentials: "include",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to view the request");
			}
			navigate(`/view-request/${adminId}`);
		} catch (error) {
			console.error("Error in viewing the request: ", error);
			alert("Error viewing request: " + error.message);
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
					{fetchError ? (
						<h4 className="font-bold mb-2 text-center text-red-600">
							{fetchError}
						</h4>
					) : notification.requests.length === 0 && notification.orders.length === 0 ? (
						<h4 className="font-bold mb-2 text-center text-gray-500">
							No notifications
						</h4>
					) : null}
					<ul className="text-sm">
						{notification.requests.map((admin, index) => (
							<li key={index} className="mb-4">
								<div className="bg-slate-400 p-2">
									<span onClick={() => viewRequest(admin._id)}>
										{admin.firstname} has a pending approval request.
									</span>
								</div>
							</li>
						))}
					</ul>
					<ul className="text-sm">
						{notification.orders.map((order, index) => (
							<li key={index} className="mb-4">
								<div className="bg-slate-200 p-2 rounded">
									<span onClick={() => viewNewOrder(order._id)}>
										Order #{order.orderNumber} has been placed.
									</span>
									<p className="text-gray-500 text-s mt-1">
										Placed on: {new Date(order.createdAt).toLocaleString()}
									</p>
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