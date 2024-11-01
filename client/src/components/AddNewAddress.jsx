import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const AddNewAddress = () => {
    const [formData, setFormData] = useState({
        addresses: [{
            streetAddress: "",
            municipality: "",
            barangay: "",
            zipCode: "",
        }],
    });
    const [availableBarangays, setAvailableBarangays] = useState([]);

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
        setFormData((prev) => {
            const updatedAddresses = [...prev.addresses];
            updatedAddresses[0][id] = value; // Update the first address object
            return {
                ...prev,
                addresses: updatedAddresses,
            };
        });

        if (id === "municipality") {
            setFormData((prev) => {
                const updatedAddresses = [...prev.addresses];
                updatedAddresses[0].barangay = ""; // Reset barangay
                updatedAddresses[0].zipCode = zipCodes[value] || ""; // Set zip code
                return {
                    ...prev,
                    addresses: updatedAddresses,
                };
            });
            setAvailableBarangays(barangays[value] || []);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { streetAddress, municipality, barangay } = formData.addresses[0];

        if (!streetAddress || !municipality || !barangay) {
            toast.error("Please fill in all address fields.");
            return;
        }

        // Here you can handle the address submission logic (e.g., send to API)
        console.log("New Address Submitted:", formData.addresses[0]);
        toast.success("Address added successfully!");

        // Reset form
        setFormData({
            addresses: [{
                streetAddress: "",
                municipality: "",
                barangay: "",
                zipCode: "",
            }],
        });
        setAvailableBarangays([]);
    };

    return (
        <div className="p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-center font-semibold my-4 text-2xl">Add New Address</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Street Address"
                    id="streetAddress"
                    required
                    className="bg-slate-100 p-3 rounded-lg"
                    onChange={handleChange}
                    value={formData.addresses[0].streetAddress}
                />
                <select
                    id="municipality"
                    required
                    onChange={handleChange}
                    value={formData.addresses[0].municipality}
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
                {formData.addresses[0].municipality && (
                    <>
                        <input
                            type="text"
                            value={formData.addresses[0].zipCode}
                            readOnly
                            className="bg-slate-100 p-3 rounded-lg"
                            placeholder="Zip Code"
                        />
                        <select
                            id="barangay"
                            required
                            onChange={handleChange}
                            value={formData.addresses[0].barangay}
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
                    className="bg-green-800 hover:bg-green-600 text-white p-3 rounded-lg font-semibold"
                >
                    Add Address
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default AddNewAddress;