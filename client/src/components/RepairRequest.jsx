import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RepairRequest = () => {
	const { orderId } = useParams();
	const [user, setUser] = useState({});
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const defaultAddress = user?.addresses?.find((addr) => addr.isDefault);

	const fetchRequestRepair = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(
				`http://localhost:3000/api/admin/notifications/view-repair-request/${orderId}`,
				{
					method: "GET",
					credentials: "include",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to fetch repair request details");
			}
			const requestRepairData = await response.json();
			console.log(requestRepairData.repairRequest);
			setUser(requestRepairData.user);
			setOrder(requestRepairData);
		} catch (error) {
			console.error("Error fetching request repair:", error);
			setError("Something went wrong while fetching repair details.");
		} finally {
			setLoading(false);
		}
	};

  console.log(order)

	const handleSubmit = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`http://localhost:3000/api/admin/notifications/requesting-for-repair/approved/${orderId}`,
				{
					method: "POST",
					credentials: "include",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to approve repair request");
			}
			toast.success("Repair request approved successfully!");
		} catch (error) {
			console.error("Error submitting repair approval:", error);
			toast.error("Failed to approve repair request.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRequestRepair();
	}, [orderId]);

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<div className="bg-slate-100 p-8 rounded">
				{/* Display user details */}
				<h2 className="text-lg font-semibold mb-2">User Details</h2>
				{user && (
					<div className="mb-4 ">
						<p>
							Name: {user.firstname} {user.lastname}
						</p>
						<p>Gender: {user.gender}</p>
						<p>Email: {user.email}</p>
						<p>
							Address:{" "}
							{defaultAddress
								? `${defaultAddress.streetAddress}, ${defaultAddress.barangay}, ${defaultAddress.municipality}, ${defaultAddress.zipCode}`
								: "No default address found"}
						</p>
					</div>
				)}
			</div>
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
				{/* Heading */}
				<h1 className="text-2xl font-semibold text-gray-700 mb-6">
					Reason for Repair
				</h1>

				{/* Loading/Error Messages */}
				{loading && <p className="text-blue-500">Loading...</p>}
				{error && <p className="text-red-500">{error}</p>}

				{/* Repair Details */}
				<div className="mb-6">
					{order?.repairRequest?.reason === 'damage_due_to_delivery' && "Damage due to delivery" }
					{order?.repairRequest?.reason === 'manufacturer_defects' && "Manufacturer defects" }
					{order?.repairRequest?.reason === 'defective_materials' && "Defective materials" }
				</div>

				{/* Submit Button */}
				<button
					onClick={handleSubmit}
					className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
					disabled={loading}
				>
					{loading ? "Submitting..." : "Approve Request"}
				</button>
			</div>
			<ToastContainer />
		</div>
	);
};

export default RepairRequest;
