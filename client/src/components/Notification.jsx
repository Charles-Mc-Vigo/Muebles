import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast notifications

const Notification = () => {
	const [notification, setNotification] = useState([]);
	const [isOpen, setIsOpen] = useState(false);

	const toggleNotification = () => {
		setIsOpen(!isOpen);
	};

	// Fetch notifications from the API
	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const response = await fetch(
					"http://localhost:3000/api/admin/notifications/pending-request",
					{
						method: "GET",
						credentials: "include",
					}
				);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				// Check if data is empty and set a message
				if (data.length === 0) {
					setNotification("No notifications available");
				} else {
					setNotification(data); // Assuming the API returns an array of admin objects
				}
			} catch (error) {
				console.error("Error fetching notifications:", error);
			}
		};
		fetchNotifications();
	}, []); // Empty dependency array means this runs once when the component mounts

	// Function to accept admin request
	const acceptRequest = async (adminId) => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/admin/notifications/accept-request/${adminId}`,
				{
					method: "POST",
					credentials: "include", // Include cookies for authentication
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				throw new Error("Failed to accept request");
			}

			const result = await response.json();
			toast.success(result.message); // Show success toast notification

			// Optionally, remove the accepted notification from the UI
			setNotification((prev) => prev.filter((admin) => admin._id !== adminId));
		} catch (error) {
			console.error("Error accepting admin request:", error);
			toast.error("Error accepting request: " + error.message); // Show error toast notification
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
				{notification.length > 0 && (
					<span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
				)}
			</button>
			{isOpen && (
				<div className="absolute right-0 mt-2 w-[300px] bg-white shadow-lg rounded-lg p-4 z-50 max-h-64 overflow-y-auto">
					<h4 className="font-bold mb-2">Pending Admin Requests</h4>
					<ul className="text-sm">
						{notification.length > 0 ? (
							notification.map((admin, index) => (
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
							))
						) : (
							<li className="mb-1">No pending admin requests.</li>
						)}
					</ul>
				</div>
			)}
			<ToastContainer /> {/* Add the ToastContainer here */}
		</div>
	);
};

export default Notification;
