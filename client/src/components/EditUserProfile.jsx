import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "react-toastify/dist/ReactToastify.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import Header from "./Header";
import Footer from "./Footer";

const EditUserProfile = () => {
	const navigate = useNavigate(); // Initialize useNavigate
	const [profile, setProfile] = useState({});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(true); // Set this to true to display the form immediately
	const [formData, setFormData] = useState({});
	const [zipCode, setZipCode] = useState("");
	const [availableBarangays, setAvailableBarangays] = useState([]);
	const [selectedImage, setSelectedImage] = useState(null);

	const zipCodes = {
		Boac: 4900,
		Mogpog: 4901,
		Santa_Cruz: 4902,
		Gasan: 4905,
		Buenavista: 4904,
		Torrijos: 4903,
	};

	const barangays = {
		Boac: [
			"Agot",
			"Agumaymayan",
			"Amoingon",
			"Apitong",
			"Balagasan",
			"Balaring",
			"Balimbing",
			"Balogo",
			"Bamban",
			"Bangbangalon",
			"Bantad",
			"Bantay",
			"Bayuti",
			"Binunga",
			"Boi",
			"Boton",
			"Buliasnin",
			"Bunganay",
			"Caganhao",
			"Canat",
			"Catubugan",
			"Cawit",
			"Daig",
			"Daypay",
			"Duyay",
			"Hinapulan",
			"Ihatub",
			"Isok I",
			"Isok II Poblacion",
			"Laylay",
			"Lupac",
			"Mahinhin",
			"Mainit",
			"Malbog",
			"Maligaya",
			"Malusak",
			"Mansiwat",
			"Mataas na Bayan",
			"Maybo",
			"Mercado",
			"Murallon",
			"Ogbac",
			"Pawa",
			"Pili",
			"Poctoy",
			"Poras",
			"Puting Buhangin",
			"Puyog",
			"Sabong",
			"San Miguel",
			"Santol",
			"Sawi",
			"Tabi",
			"Tabigue",
			"Tagwak",
			"Tambunan",
			"Tampus",
			"Tanza",
			"Tugos",
			"Tumagabok",
			"Tumapon",
		],
		Mogpog: [
			"Anapog-Sibucao",
			"Argao",
			"Balanacan",
			"Banto",
			"Bintakay",
			"Bocboc",
			"Butansapa",
			"Candahon",
			"Capayang",
			"Danao",
			"Dulong Bayan",
			"Gitnang Bayan",
			"Guisian",
			"Hinadharan",
			"Hinanggayon",
			"Ino",
			"Janagdong",
			"Lamesa",
			"Laon",
			"Magapua",
			"Malayak",
			"Malusak",
			"Mampaitan",
			"Mangyan-Mababad",
			"Market Site",
			"Mataas na Bayan",
			"Mendez",
			"Nangka I",
			"Nangka II",
			"Paye",
			"Pili",
			"Puting Buhangin",
			"Sayao",
			"Silangan",
			"Sumangga",
			"Tarug",
			"Villa Mendez",
		],
		Santa_Cruz: [
			"Alobo",
			"Angas",
			"Aturan",
			"Bagong Silang Poblacion",
			"Baguidbirin",
			"Baliis",
			"Balogo",
			"Banahaw Poblacion",
			"Bangcuangan",
			"Banogbog",
			"Biga",
			"Botilao",
			"Buyabod",
			"Dating Bayan",
			"Devilla",
			"Dolores",
			"Haguimit",
			"Hupi",
			"Ipil",
			"Jolo",
			"Kaganhao",
			"Kalangkang",
			"Kamandugan",
			"Kasily",
			"Kilo-kilo",
			"Kiñaman",
			"Labo",
			"Lamesa",
			"Landy",
			"Lapu-lapu Poblacion",
			"Libjo",
			"Lipa",
			"Lusok",
			"Maharlika Poblacion",
			"Makulapnit",
			"Maniwaya",
			"Manlibunan",
			"Masaguisi",
			"Masalukot",
			"Matalaba",
			"Mongpong",
			"Morales",
			"Napo",
			"Pag-asa Poblacion",
			"Pantayin",
			"Polo",
			"Pulong-Parang",
			"Punong",
			"San Antonio",
			"San Isidro",
			"Tagum",
			"Tamayo",
			"Tambangan",
			"Tawiran",
			"Taytay",
		],
		Gasan: [
			"Antipolo",
			"Bachao Ibaba",
			"Bachao Ilaya",
			"Bacongbacong",
			"Bahi",
			"Bangbang",
			"Banot",
			"Banuyo",
			"Barangay I",
			"Barangay II",
			"Barangay III",
			"Bognuyan",
			"Cabugao",
			"Dawis",
			"Dili",
			"Libtangin",
			"Mahunig",
			"Mangiliol",
			"Masiga",
			"Matandang Gasan",
			"Pangi",
			"Pingan",
			"Tabionan",
			"Tapuyan",
			"Tiguion",
		],
		Buenavista: [
			"Bagacay",
			"Bagtingon",
			"Barangay I",
			"Barangay II",
			"Barangay III",
			"Barangay IV",
			"Bicas-bicas",
			"Caigangan",
			"Daykitin",
			"Libas",
			"Malbog",
			"Sihi",
			"Timbo",
			"Tungib-Lipata",
			"Yook",
		],
		Torrijos: [
			"Bangwayin",
			"Bayakbakin",
			"Bolo",
			"Bonliw",
			"Buangan",
			"Cabuyo",
			"Cagpo",
			"Dampulan",
			"Kay Duke",
			"Mabuhay",
			"Makawayan",
			"Malibago",
			"Malinao",
			"Maranlig",
			"Marlangga",
			"Matuyatuya",
			"Nangka",
			"Pakaskasan",
			"Payanas",
			"Poblacion",
			"Poctoy",
			"Sibuyao",
			"Suha",
			"Talawan",
			"Tigwi",
		],
	};

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
			setFormData(data); // Initialize form data with fetched profile
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProfile();
	}, []);

	const handleImageChange = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			setSelectedImage(e.target.files[0]);
		}
	};

	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));
		if (id === "municipality") {
			setZipCode(zipCodes[value] || "");
			setAvailableBarangays(barangays[value] || []);
			setFormData((prev) => ({ ...prev, barangay: "" }));
		}
	};

	const handleSave = async (e) => {
		e.preventDefault();
		try {
			const dataToUpdate = {
				firstname: formData.firstname,
				lastname: formData.lastname,
				gender: formData.gender,
				phoneNumber: formData.phoneNumber,
				streetAddress: formData.streetAddress,
				municipality: formData.municipality,
				barangay: formData.barangay,
				zipCode: zipCode,
				email: formData.email,
			};

			if (selectedImage) {
				const formDataToSend = new FormData();
				formDataToSend.append("image", selectedImage);
				Object.keys(dataToUpdate).forEach((key) => {
					formDataToSend.append(key, dataToUpdate[key]);
				});

				const response = await fetch(
					"http://localhost:3000/api/users/setting/my-profile/update",
					{
						method: "PUT",
						body: formDataToSend,
						credentials: "include",
					}
				);

				const responseData = await response.json();
				if (!response.ok) {
					throw new Error(responseData.message || "Update failed");
				}

				setProfile(responseData.user);
				toast.success("Profile updated successfully!");
			} else {
				const response = await fetch(
					"http://localhost:3000/api/users/setting/my-profile/update",
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(dataToUpdate),
						credentials: "include",
					}
				);

				const responseData = await response.json();
				if (!response.ok) {
					throw new Error(responseData.message || "Update failed");
				}

				setProfile(responseData.user);
				toast.success("Profile updated successfully!");
			}

			// Redirect to the specified path after a short delay
			setTimeout(() => {
				navigate("/my-profile/view"); // Use navigate to redirect
			}, 2000); // Delay of 2000 milliseconds (2 seconds)

			setIsEditing(false);
		} catch (error) {
			console.error("Update error:", error.message);
			toast.error(
				error.message || "An unexpected error occurred. Please try again."
			);
		}
	};
	if (loading) return <p>Loading profile...</p>;
	if (error) return <p>{error}</p>;

	return (
		<div>
			<Header />
			<div className="profile-container w-full max-w-screen-lg mx-auto p-8 bg-gray-300 shadow-md rounded-lg mb-5 mt-5">
				<div className="flex items-center gap-5 mb-6">
					<button
						onClick={() => navigate(-1)} // Navigate to the previous page
						className="text-gray-500 hover:text-teal-600"
					>
						<IoMdArrowRoundBack size={28} />{" "}
						{/* Adjust the icon size to better match the text */}
					</button>

					<h1 className="text-2xl font-semibold text-gray-700">My profile</h1>
				</div>

				{isEditing && (
					<form onSubmit={handleSave} className="flex flex-col gap-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<input
								type="text"
								placeholder="Firstname"
								id="firstname"
								required
								className="bg-slate-100 p-3 rounded-lg"
								onChange={handleChange}
								value={formData.firstname}
							/>
							<input
								type="text"
								placeholder="Lastname"
								id="lastname"
								required
								className="bg-slate-100 p-3 rounded-lg"
								onChange={handleChange}
								value={formData.lastname}
							/>
						</div>
						<select
							id="gender"
							value={formData.gender}
							onChange={handleChange}
							required
							className="bg-slate-100 p-3 rounded-lg"
						>
							<option value="" disabled hidden>
								Gender
							</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
						</select>
						<input
							type="tel"
							placeholder="+639XXXXXXXXX"
							id="phoneNumber"
							required
							className="bg-slate-100 p-3 rounded-lg"
							onChange={handleChange}
							value={formData.phoneNumber}
						/>
						<select
							name="municipality"
							id="municipality"
							required
							onChange={handleChange}
							value={formData.municipality}
							className="bg-slate-100 p-3 rounded-lg"
						>
							<option value="" disabled hidden>
								Select Municipality
							</option>
							{Object.keys(zipCodes).map((municipality) => (
								<option key={municipality} value={municipality}>
									{municipality}
								</option>
							))}
						</select>
						{formData.municipality && (
							<>
								<input
									type="text"
									value={zipCode}
									readOnly
									className="bg-slate-100 p-3 rounded-lg"
									placeholder="Zip Code"
								/>
								<select
									id="barangay"
									required
									onChange={handleChange}
									value={formData.barangay}
									className="bg-slate-100 p-3 rounded-lg"
								>
									<option value="" disabled hidden>
										Select Barangay
									</option>
									{availableBarangays.map((barangay) => (
										<option key={barangay} value={barangay}>
											{barangay}
										</option>
									))}
								</select>
							</>
						)}
						<input
							type="text"
							placeholder="Street Address"
							id="streetAddress"
							required
							className="bg-slate-100 p-3 rounded-lg"
							onChange={handleChange}
							value={formData.streetAddress}
						/>
						<input
							type="email"
							placeholder="Email"
							id="email"
							required
							className="bg-slate-100 p-3 rounded-lg"
							onChange={handleChange}
							value={formData.email}
						/>
						<input type="file" accept="image/*" onChange={handleImageChange} />
						<button
							type="submit"
							className="w-full bg-teal-500 text-white p-3 rounded-lg font-semibold"
						>
							Save Changes
						</button>
						<ToastContainer />
					</form>
				)}
			</div>
			<Footer />
		</div>
	);
};

export default EditUserProfile;
