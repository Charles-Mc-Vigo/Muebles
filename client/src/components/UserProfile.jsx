import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Footer from "./Footer";
import EditUserProfile from "./EditUserProfile";
import OrderDetails from "../pages/OrderDetails";

const UserProfile = () => {
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({});
	const [activeSection, setActiveSection] = useState("manageAccount");
	const navigate = useNavigate();

	useEffect(() => {
		fetchProfile();
	}, []);

	const fetchProfile = async () => {
		try {
			const response = await fetch(
				"http://localhost:3000/api/users/setting/my-profile/view",
				{
					method: "GET",
					credentials: "include",
				}
			);
			if (!response.ok) {
				throw new Error("Unable to load profile. Please try again later.");
			}
			const data = await response.json();
			setProfile(data);
			setFormData(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleEditToggle = () => {
		setIsEditing(!isEditing);
		if (!isEditing) {
			navigate("/my-profile/edit"); // Change URL when entering edit mode
		}
	};

	const handleSave = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(
				"http://localhost:3000/api/users/setting/my-profile/update",
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
					credentials: "include",
				}
			);
			const responseData = await response.json();
			if (!response.ok)
				throw new Error(responseData.message || "Update failed");
			setProfile(responseData.user);
			toast.success("Profile updated successfully!");
			setIsEditing(false);
			navigate("/my-profile/view");
		} catch (error) {
			toast.error(
				error.message || "An unexpected error occurred. Please try again."
			);
		}
	};

	if (loading)
		return <p className="text-center text-lg">Loading your profile...</p>;
	if (error) return <p className="text-center text-red-500">{error}</p>;

	// Content mapping for the active section
	const contentMap = {
		manageAccount: (
			<div className="flex flex-col lg:flex-row gap-8 w-full">
				<div className="flex-1 p-6 bg-white border rounded-lg shadow flex flex-col">
					<h2 className="font-bold text-lg">
						Personal Profile
						<button onClick={handleEditToggle} className="text-blue-600 ml-2">
							EDIT
						</button>
					</h2>
					{isEditing ? (
						<form onSubmit={handleSave} className="flex-grow">
							<input
								type="text"
								value={formData.firstname}
								onChange={(e) =>
									setFormData({ ...formData, firstname: e.target.value })
								}
								placeholder="First Name"
								className="border p-2 mt-2 w-full"
							/>
							<input
								type="text"
								value={formData.lastname}
								onChange={(e) =>
									setFormData({ ...formData, lastname: e.target.value })
								}
								placeholder="Last Name"
								className="border p-2 mt-2 w-full"
							/>
							<input
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								placeholder="Email"
								className="border p-2 mt-2 w-full"
							/>
							<button
								type="submit"
								className="mt-4 bg-blue-600 text-white p-2 rounded"
							>
								Save
							</button>
						</form>
					) : (
						<>
							<p className="mt-4">
								{profile.firstname} {profile.lastname}
							</p>
							<p className="text-gray-500">{profile.email}</p>
							<label className="mt-4 flex items-center">
								<input type="checkbox" className="mr-2" /> Receive marketing
								emails
							</label>
						</>
					)}
				</div>
				<div className="flex-1 p-6 bg-white border rounded-lg shadow flex flex-col">
					<h2 className="font-bold text-lg">Address Book</h2>
					<div className="mt-4 flex-grow flex flex-col">
						<p className="font-semibold mb-2">DEFAULT SHIPPING ADDRESS</p>
						{profile.addresses ? (
							profile.addresses
								.filter((address) => address.isDefault)
								.map((defaultAddress, index) => (
									<div key={index}>
										<p className="tracking-wide">{defaultAddress.streetAddress}, {defaultAddress.barangay}, {defaultAddress.municipality}, {defaultAddress.zipCode}</p>
									</div>
								))
						) : (
							<p>No default address available</p>
						)}
					</div>
				</div>
			</div>
		),
		personalProfile: (
			<div className="profile-container w-full max-w-screen-lg mx-auto p-8 bg-white shadow-md rounded-lg mt-5 mb-5">
				<img
					src={
						profile && profile.image && profile.image.startsWith("data:")
							? profile.image
							: profile?.image || "default-profile-image.jpg" // Use a default image if profile.image is undefined
					}
					alt={`${profile?.firstname || ""} ${
						profile?.lastname || ""
					}'s Profile Picture`}
					className="w-24 h-24 rounded-full object-cover mb-2 shadow-lg transition-transform group-hover:scale-105"
				/>
				<h1 className="text-xl font-semibold text-gray-700 mb-3">My profile</h1>

				<div className="profile-details grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
					<div>
						<p className="text-sm text-gray-500">Full Name</p>
						<p className="text-lg font-medium text-gray-800">
							{profile.firstname} {profile.lastname}
						</p>
					</div>

					<div>
						<p className="text-sm text-gray-500 flex justify-between">
							<span>Email Address</span>
						</p>
						<p className="text-lg font-medium text-gray-800">{profile.email}</p>
						<label className="flex items-center mt-2 text-gray-700">
							<input type="checkbox" className="mr-2" />
							Receive marketing emails
						</label>
					</div>

					<div>
						<p className="text-sm text-gray-500 flex justify-between">
							<span>Mobile</span>
						</p>
						<p className="text-lg font-medium text-gray-800">
							{profile.phoneNumber || "Please enter your mobile"}
						</p>
					</div>

					<div>
						<p className="text-sm text-gray-500">Gender</p>
						<p className="text-lg font-medium text-gray-800">
							{profile.gender || "Please enter your gender"}
						</p>
					</div>
				</div>

				<div className="button-container mt-5 flex flex-col space-y-4">
					<Link
						to="/my-profile/edit"
						className="bg-teal-500 text-white px-6 py-3 rounded-md hover:bg-teal-600 transition duration-300 text-center"
					>
						Edit Profile
					</Link>
				</div>
			</div>
		),
		addressBook: (
			<div className="p-6 bg-white border rounded-lg shadow-lg overflow-auto">
				<h2 className="font-bold text-2xl mb-4">Address</h2>
				<div className="overflow-x-auto">
					<table className="min-w-full table-auto border-collapse">
						<thead>
							<tr className="bg-gray-200">
								<th className="px-4 py-2 text-left font-semibold">Full Name</th>
								<th className="px-4 py-2 text-left font-semibold">Address</th>
								<th className="px-4 py-2 text-left font-semibold">
									Phone Number
								</th>
								<th className="px-4 py-2 text-left font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody>
							<tr className="border-b">
								<td className="px-4 py-2">
									{profile.firstname} {profile.lastname}
								</td>
								<td className="px-4 py-2">
									{profile.addresses.map((address, index) => (
										<div key={index}>
											<p>
												{address.streetAddress}, {address.barangay},{" "}
												{address.municipality}, {address.zipCode}
												{address.isDefault && (
													<span className="ml-2 text-sm text-green-600 font-semibold">
														(Default)
													</span>
												)}
											</p>
										</div>
									))}
								</td>
								<td className="px-4 py-2">{profile.phoneNumber}</td>
								<td className="px-4 py-2">
									<a href="#" className="text-blue-500">
										EDIT
									</a>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<Link to={"/address/new"}>
					<button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
						+ ADD NEW ADDRESS
					</button>
				</Link>
			</div>
		),
		myOrders: <OrderDetails />,
	};

	return (
		<div>
			<Header isLogin={true} cartCount={true} />
			<div className="flex flex-col lg:flex-row my-8 p-5 bg-gray-100 w-full border rounded-lg shadow-lg">
				<aside className="w-full lg:w-1/4 bg-white border-r border-gray-200 mb-5 lg:mb-0 mr-5 rounded-md">
					<nav className="space-y-4 text-gray-700 p-4">
						<button
							onClick={() => setActiveSection("manageAccount")}
							className={`block font-bold ${
								activeSection === "manageAccount"
									? "text-teal-600"
									: "hover:text-teal-600"
							}`}
						>
							Manage My Account
						</button>
						<button
							onClick={() => setActiveSection("personalProfile")}
							className={`block ${
								activeSection === "personalProfile"
									? "text-teal-600"
									: "hover:text-teal-600"
							}`}
						>
							My Profile
						</button>
						<button
							onClick={() => setActiveSection("addressBook")}
							className={`block ${
								activeSection === "addressBook"
									? "text-teal-600"
									: "hover:text-teal-600"
							}`}
						>
							Address
						</button>
						<button
							onClick={() => setActiveSection("myOrders")}
							className={`block font-bold ${
								activeSection === "myOrders"
									? "text-teal-600"
									: "hover:text-teal-600"
							}`}
						>
							My Orders
						</button>
					</nav>
				</aside>
				<main className="flex-1">{contentMap[activeSection]}</main>
			</div>
			<Footer />
			<ToastContainer />
		</div>
	);
};

export default UserProfile;
