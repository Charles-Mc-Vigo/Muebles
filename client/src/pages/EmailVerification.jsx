import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast notifications

const EmailVerification = () => {
	const { userId } = useParams();
	const [code, setCode] = useState("");
	const [user, setUser] = useState(null); // State for storing the user object
	const [isResendDisabled, setIsResendDisabled] = useState(false); // State for button disable
	const [resendTimer, setResendTimer] = useState(60); // Countdown timer for resend button
	const navigate = useNavigate();

	// Fetch user data when the component mounts
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/api/users/unconfirmed/${userId}`
				);
				if (!response.ok) {
					throw new Error("User not found");
				}
				const userData = await response.json();
				setUser(userData); // Set the entire user object
			} catch (error) {
				console.error("Error fetching user:", error);
				toast.error("Could not fetch user data. Please try again.");
			}
		};
		fetchUser();
	}, [userId]);

	const handleCodeChange = (e) => {
		const codeValue = e.target.value;
		if (codeValue.length <= 6 && /^[0-9]*$/.test(codeValue)) {
			setCode(codeValue);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(
				`http://localhost:3000/api/users/verify-email/${userId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ code }),
				}
			);
			const data = await response.json();

			toast.success("Account verified successfully!");

			// Add a timeout to delay the redirection to home
			setTimeout(() => {
				navigate("/login");
			}, 3000); // Delay for 3 seconds (3000 milliseconds)
		} catch (error) {
			console.error("Error verifying email:", error);
			toast.error("Error verifying email. Please try again.");
		}
	};

	const handleResendCode = async () => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/users/resend-verification/${userId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (!response.ok) {
				throw new Error("Failed to resend verification code");
			}
			toast.success("Verification code resent successfully!");

			// Disable the button and start the timer
			setIsResendDisabled(true);
			setResendTimer(60); // Set the timer to 60 seconds

			const intervalId = setInterval(() => {
				setResendTimer((prevTimer) => {
					if (prevTimer === 1) {
						clearInterval(intervalId); // Stop the interval when time is up
						setIsResendDisabled(false); // Re-enable the button
					}
					return prevTimer - 1;
				});
			}, 1000);
		} catch (error) {
			console.error("Error resending verification code:", error);
			toast.error("Error resending verification code. Please try again.");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
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
							{user ? user.email : "loading..."}
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
					<button
						type="button"
						onClick={handleResendCode}
						disabled={isResendDisabled} // Disable button when needed
						className={`mt-4 w-full py-3 px-4 ${
							isResendDisabled
								? "bg-gray-300 text-gray-500 cursor-not-allowed"
								: "bg-gray-300 text-gray-800 hover:bg-gray-400"
						} font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500`}
					>
						{isResendDisabled
							? `Resend available in ${resendTimer}s`
							: "Resend Verification Code"}
					</button>
				</form>
			</div>
			<ToastContainer /> {/* Add ToastContainer to render toasts */}
		</div>
	);
};

export default EmailVerification;
