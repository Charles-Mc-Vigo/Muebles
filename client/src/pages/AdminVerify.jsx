import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const AdminVerify = () => {
	const { adminId } = useParams();
	const [admin, setAdmin] = useState(null);
	const [code, setCode] = useState("");
	const navigate = useNavigate();

	const handleCodeChange = (e) => {
		const codeValue = e.target.value;
		// Ensure the code is 6 digits and numeric
		if (codeValue.length <= 6 && /^[0-9]*$/.test(codeValue)) {
			setCode(codeValue); // Corrected setCode
		}
	};

	useEffect(() => {
		const fetchAdmin = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/api/admin/${adminId}`
				);
				if (!response.ok) {
					throw new Error("User not found");
				}
				const adminData = await response.json();
				setAdmin(adminData); // Set the entire user object
			} catch (error) {
				console.error("Error fetching user:", error);
				toast.error("Could not fetch admin data. Please try again.");
			}
		};
		fetchAdmin();
	}, [adminId]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(
				`http://localhost:3000/api/admin/admin-verification/${adminId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json", // Set the content type to JSON
					},
					body: JSON.stringify({
						email: admin.email, // Make sure to send the email of the admin
						code,
					}),
				}
			);
			const data = await response.json(); // Parse the JSON response
			if (!response.ok) {
				throw new Error(data.message || "Account verification unsuccessful!");
			}
			toast.success("Admin verified successfully!"); // Notify success

      setTimeout(()=>{
        navigate(`/admin-verification/${adminId}/pending`, { state: { message: data.message } });
      },3000)
		} catch (error) {
			console.error("Error verifying email:", error);
			toast.error(error.message); // Notify error
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<ToastContainer /> {/* Add ToastContainer to render toasts */}
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-semibold text-center mb-6">
					Email Verification
				</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							We have sent a verification email to{" "}
							{admin ? admin.email : "loading..."}
						</label>
					</div>
					<div className="mb-6">
						<label
							htmlFor="code"
							className="block text-sm font-medium text-gray-700"
						>
							Verification Code
						</label>
						<input
							type="text"
							id="code"
							value={code}
							onChange={handleCodeChange}
							required
							className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							placeholder="Enter 6-digit code"
							maxLength="6"
						/>
					</div>
					<button
						type="submit"
						className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					>
						Verify
					</button>
				</form>
			</div>
		</div>
	);
};

export default AdminVerify;