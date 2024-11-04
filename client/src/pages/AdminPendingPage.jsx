import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminPendingPage = () => {
	const { adminId } = useParams(); // Get the adminId from the URL parameters
	const navigate = useNavigate();
	const [admin, setAdmin] = useState(null); // State to store admin data
	const [pendingMessage, setPendingMessage] = useState(""); // State to store the pending message

	useEffect(() => {
		const fetchAdmin = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/api/admin/unconfirmed/${adminId}`,
					{
						method: "GET",
					}
				);
				if (!response.ok) {
					throw new Error("Admin not found");
				}
				const adminData = await response.json();
				setAdmin(adminData);

				// Check if the adminApproval status is "Pending" and set the message
				if (adminData.adminApproval === "Pending") {
					setPendingMessage(adminData.message);
					toast.info("Admin approval is still pending");
				} else if (adminData.adminApproval === "Accepted") {
					toast.success("Your Admin request is accepted successfully!");
					setTimeout(() => {
						navigate("/dashboard");
					}, 3000);
				} else {
					toast.error("Admin approval was rejected.");
					setTimeout(() => {
						navigate("/admin-signup");
					}, 3000);
				}
			} catch (error) {
				console.error("Error fetching admin:", error);
				toast.error(
					error.message || "Could not fetch admin data. Please try again."
				);
			}
		};
		fetchAdmin();
	}, [adminId, navigate]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<div className="bg-white shadow-md rounded-lg p-8 max-w-lg text-center">
				<h1 className="text-3xl font-bold mb-4 text-gray-800">
					Pending Admin Request
				</h1>
				{pendingMessage ? (
					<p className="text-lg text-gray-600">{pendingMessage}</p>
				) : (
					<p className="text-lg text-gray-400">No message available.</p>
				)}
			</div>
			<ToastContainer />
		</div>
	);
};

export default AdminPendingPage;
