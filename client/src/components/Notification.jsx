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
		requestRepairs: [],
	});
	
	const [isOpen, setIsOpen] = useState(false);
	const [fetchError, setFetchError] = useState(null); // New state for fetch error
	const navigate = useNavigate();

	const toggleNotification = () => {
		setIsOpen(!isOpen);
	};

	const fetchNotifications = async () => {
		try {
			const [requestsResponse, ordersResponse, repairRequestResponse] =
				await Promise.all([
					fetch(
						"http://localhost:3000/api/admin/notifications/pending-request",
						{
							method: "GET",
							credentials: "include",
						}
					),
					fetch(
						"http://localhost:3000/api/admin/notifications/pending-orders",
						{
							method: "GET",
							credentials: "include",
						}
					),
					fetch(
						"http://localhost:3000/api/admin/notifications/requesting-for-repair",
						{
							method: "GET",
							credentials: "include",
						}
					),
				]);

			if (
				!requestsResponse.ok ||
				!ordersResponse.ok ||
				!repairRequestResponse.ok
			) {
				setFetchError("Failed to fetch notifications. Please try again later.");
				return;
			}

			const requestsData = await requestsResponse.json();
			const ordersData = await ordersResponse.json();
			const repairRequestData = await repairRequestResponse.json();

			setNotification({
				requests: requestsData.length > 0 ? requestsData : [],
				orders: ordersData.length > 0 ? ordersData : [],
				requestRepairs: repairRequestData.length > 0 ? repairRequestData : [],
			});
			setFetchError(null); // Clear any previous errors
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

	const viewRepairRequest = async (orderId) => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/admin/notifications/view-repair-request/${orderId}`,
				{
					method: "GET",
					credentials: "include",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to view the repair request");
			}
			navigate(`/view-repair-request/${orderId}`);
		} catch (error) {
			console.error("Error viewing the repair request: ", error);
			alert("Error viewing repair request: " + error.message);
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
				{notification.requests.length > 0 || notification.orders.length > 0 || notification.requestRepairs.length > 0? (
					<span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
				) : null}
			</button>
			{isOpen && (
				<div className="absolute right-0 mt-2 w-[300px] bg-white shadow-lg rounded-lg p-4 z-50 max-h-[500px] overflow-y-auto">
					{fetchError ? (
						<h4 className="font-bold mb-2 text-center text-red-600">
							{fetchError}
						</h4>
					) : notification.requests.length === 0 &&
					  notification.orders.length === 0 &&
					  notification.requestRepairs.length === 0 ? (
						<h4 className="font-bold mb-2 text-center text-gray-500">
							No notifications
						</h4>
					) : null}
					<ul className="text-sm">
						{notification.requests.map((admin, index) => (
							<li key={index} className="mb-4">
								<div className="bg-slate-100 p-2">
									<span onClick={() => viewRequest(admin._id)}>
										{admin.firstname} has a pending approval request.
									</span>
								</div>
							</li>
						))}
					</ul>
					<ul className="text-sm">
						{notification.orders.map((order, index) => (
							<li key={index} className="mb-5">
								<div className="bg-slate-50 p-2 rounded">
									<span onClick={() => viewNewOrder(order._id)}>
										Order #{order.orderNumber} has been placed.
									</span>
									<p className="text-gray-500 text-s mt-5">
										Placed on: {new Date(order.createdAt).toLocaleString()}
									</p>
								</div>
							</li>
						))}
					</ul>
					<ul className="text-sm">
						{notification.requestRepairs.map((order, index) => (
							<li key={index} className="mb-5">
								<div className="bg-slate-50 p-2 rounded">
									<span onClick={() => viewRepairRequest(order._id)}>
										{order.user?.firstname} is requesting a repair for Order #
										{order.orderNumber}.
									</span>
									<p className="text-gray-500 text-s mt-5">
										Requested on: {new Date(order.createdAt).toLocaleString()}
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
