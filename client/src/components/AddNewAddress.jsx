import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const AddNewAddress = () => {
	const [formData, setFormData] = useState({
		streetAddress: "",
		municipality: "",
		barangay: "",
		zipCode: "",
	});
	const [availableBarangays, setAvailableBarangays] = useState([]);
	const navigate = useNavigate();

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

	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));

		if (id === "municipality") {
			setFormData((prev) => ({
				...prev,
				barangay: "",
				zipCode: zipCodes[value] || "",
			}));
			setAvailableBarangays(barangays[value] || []);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { streetAddress, municipality, barangay, zipCode } = formData;

		// Validate address fields
		if (!streetAddress || !municipality || !barangay || !zipCode) {
			toast.error("Please fill in all address fields.");
			return;
		}

		try {
			// Send the POST request to the API endpoint
			const response = await fetch("http://localhost:3000/api/users/address/new", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					streetAddress,
					municipality,
					barangay,
					zipCode,
				}),
			});

			// Check if the response is okay
			if (!response.ok) {
				const errorData = await response.json();
				toast.error(`Error: ${errorData.error || "Failed to add address."}`);
				return;
			}

			// Parse the response
			const data = await response.json();
			toast.success("Address added successfully!");

			// Reset form
			setFormData({
				streetAddress: "",
				municipality: "",
				barangay: "",
				zipCode: "",
			});
			setAvailableBarangays([]);

			// Optionally, you can update the user state with the new address if needed
			// updateUserAddresses(data.addresses);
		} catch (error) {
			console.error("Error while submitting address:", error);
			toast.error("Server error! Please try again later.");
		}
	};

	return (
		<div className="bg-white">
			<Header />
			<div className="p-5 bg-gray-200 shadow-lg rounded-lg mb-5 mt-5 w-3/4 flex flex-col mx-auto">
				<button
					onClick={() => navigate(-1)}
					className="text-gray-500 mr-2 mb-2"
				>
					<IoMdArrowRoundBack size={40} />
				</button>
				<h2 className="text-center font-semibold my-2 text-2xl">
					Add New Address
				</h2>
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="Street Address"
						id="streetAddress"
						required
						className="bg-slate-100 p-3 rounded-lg"
						onChange={handleChange}
						value={formData.streetAddress}
					/>
					<select
						id="municipality"
						required
						onChange={handleChange}
						value={formData.municipality}
						className="bg-slate-100 p-3 rounded-lg"
					>
						<option value="" disabled hidden>
							Select Municipality
						</option>
						<option value="Boac">Boac</option>
						<option value="Mogpog">Mogpog</option>
						<option value="Santa_Cruz">Santa Cruz</option>
						<option value="Gasan">Gasan</option>
						<option value="Buenavista">Buenavista</option>
						<option value="Torrijos">Torrijos</option>
					</select>
					{formData.municipality && (
						<>
							<input
								type="text"
								value={formData.zipCode}
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
					<button
						type="submit"
						className="bg-teal-600 hover:bg-teal-800 text-white p-3 rounded-lg font-semibold"
					>
						Add Address
					</button>
				</form>
				<ToastContainer />
			</div>
			<Footer />
		</div>
	);
};

export default AddNewAddress;
