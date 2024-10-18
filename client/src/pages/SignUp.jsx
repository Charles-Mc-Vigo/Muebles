import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header"; // Import Header
import Footer from "../components/Footer"; // Import Footer (assuming it's in the same directory)
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    phoneNumber: "",
    streetAddress: "",
    municipality: "",
    barangay: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: "",
  });
  const [zipCode, setZipcode] = useState("");
  const [availableBarangays, setAvailableBarangays] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
    if (id === "municipality") {
      setZipcode(zipCodes[value] || "");
      setAvailableBarangays(barangays[value] || []);
      setFormData((prev) => ({ ...prev, barangay: "" }));
    }
  };

  const zipCodes = {
    Boac: 4900,
    Mogpog: 4901,
    Santa_Cruz: 4902,
    Gasan: 4905,
    Buenavista: 4904,
    Torrijos: 4903,
  };

  const barangays = {
    Boac: ["Agot", "Agumaymayan", "Amoingon", "Apitong", "Balagasan", "Balaring", "Balimbing", "Balogo", "Bamban", "Bangbangalon", "Bantad", "Bantay", "Bayuti", "Binunga", "Boi", "Boton", "Buliasnin", "Bunganay", "Caganhao", "Canat", "Catubugan", "Cawit", "Daig", "Daypay", "Duyay", "Hinapulan", "Ihatub", "Isok I", "Isok II Poblacion", "Laylay", "Lupac", "Mahinhin", "Mainit", "Malbog", "Maligaya", "Malusak", "Mansiwat", "Mataas na Bayan", "Maybo", "Mercado", "Murallon", "Ogbac", "Pawa", "Pili", "Poctoy", "Poras", "Puting Buhangin", "Puyog", "Sabong", "San Miguel", "Santol", "Sawi", "Tabi", "Tabigue", "Tagwak", "Tambunan", "Tampus", "Tanza", "Tugos", "Tumagabok", "Tumapon"],
    Mogpog: ["Anapog-Sibucao", "Argao", "Balanacan", "Banto", "Bintakay", "Bocboc", "Butansapa", "Candahon", "Capayang", "Danao", "Dulong Bayan", "Gitnang Bayan", "Guisian", "Hinadharan", "Hinanggayon", "Ino", "Janagdong", "Lamesa", "Laon", "Magapua", "Malayak", "Malusak", "Mampaitan", "Mangyan-Mababad", "Market Site", "Mataas na Bayan", "Mendez", "Nangka I", "Nangka II", "Paye", "Pili", "Puting Buhangin", "Sayao", "Silangan", "Sumangga", "Tarug", "Villa Mendez"],
    Santa_Cruz: ["Alobo", "Angas", "Aturan", "Bagong Silang Poblacion", "Baguidbirin", "Baliis", "Balogo", "Banahaw Poblacion", "Bangcuangan", "Banogbog", "Biga", "Botilao", "Buyabod", "Dating Bayan", "Devilla", "Dolores", "Haguimit", "Hupi", "Ipil", "Jolo", "Kaganhao", "Kalangkang", "Kamandugan", "Kasily", "Kilo-kilo", "Kiñaman", "Labo", "Lamesa", "Landy", "Lapu-lapu Poblacion", "Libjo", "Lipa", "Lusok", "Maharlika Poblacion", "Makulapnit", "Maniwaya", "Manlibunan", "Masaguisi", "Masalukot", "Matalaba", "Mongpong", "Morales", "Napo", "Pag-asa Poblacion", "Pantayin", "Polo", "Pulong-Parang", "Punong", "San Antonio", "San Isidro", "Tagum", "Tamayo", "Tambangan", "Tawiran", "Taytay"],
    Gasan: ["Antipolo", "Bachao Ibaba", "Bachao Ilaya", "Bacongbacong", "Bahi", "Bangbang", "Banot", "Banuyo", "Barangay I", "Barangay II", "Barangay III", "Bognuyan", "Cabugao", "Dawis", "Dili", "Libtangin", "Mahunig", "Mangiliol", "Masiga", "Matandang Gasan", "Pangi", "Pingan", "Tabionan", "Tapuyan", "Tiguion"],
    Buenavista: ["Bagacay", "Bagtingon", "Barangay I", "Barangay II", "Barangay III", "Barangay IV", "Bicas-bicas", "Caigangan", "Daykitin", "Libas", "Malbog", "Sihi", "Timbo", "Tungib-Lipata", "Yook"],
    Torrijos: ["Bangwayin", "Bayakbakin", "Bolo", "Bonliw", "Buangan", "Cabuyo", "Cagpo", "Dampulan", "Kay Duke", "Mabuhay", "Makawayan", "Malibago", "Malinao", "Maranlig", "Marlangga", "Matuyatuya", "Nangka", "Pakaskasan", "Payanas", "Poblacion", "Poctoy", "Sibuyao", "Suha", "Talawan", "Tigwi"]
    Boac: ["Agot", "Agumaymayan", "Amoingon", "Apitong", "Balagasan", "Balaring", "Balimbing", "Balogo", "Bamban", "Bangbangalon", "Bantad", "Bantay", "Bayuti", "Binunga", "Boi", "Boton", "Buliasnin", "Bunganay", "Caganhao", "Canat", "Catubugan", "Cawit", "Daig", "Daypay", "Duyay", "Hinapulan", "Ihatub", "Isok I", "Isok II Poblacion", "Laylay", "Lupac", "Mahinhin", "Mainit", "Malbog", "Maligaya", "Malusak", "Mansiwat", "Mataas na Bayan", "Maybo", "Mercado", "Murallon", "Ogbac", "Pawa", "Pili", "Poctoy", "Poras", "Puting Buhangin", "Puyog", "Sabong", "San Miguel", "Santol", "Sawi", "Tabi", "Tabigue", "Tagwak", "Tambunan", "Tampus", "Tanza", "Tugos", "Tumagabok", "Tumapon"],
    Mogpog: ["Anapog-Sibucao", "Argao","Balanacan","Banto","Bintakay","Bocboc","Butansapa","Candahon","Capayang","Danao","Dulong Bayan","Gitnang Bayan","Guisian","Hinadharan","Hinanggayon","Ino","Janagdong","Lamesa","Laon","Magapua","Malayak","Malusak","Mampaitan","Mangyan-Mababad","Market Site","Mataas na Bayan","Mendez","Nangka I","Nangka II","Paye","Pili","Puting Buhangin","Sayao","Silangan","Sumangga","Tarug","Villa Mendez"],
    Santa_Cruz: ["Alobo", "Angas", "Aturan", "Bagong Silang Poblacion", "Baguidbirin", "Baliis", "Balogo", "Banahaw Poblacion", "Bangcuangan", "Banogbog", "Biga", "Botilao", "Buyabod", "Dating Bayan", "Devilla", "Dolores", "Haguimit", "Hupi", "Ipil", "Jolo", "Kaganhao", "Kalangkang", "Kamandugan", "Kasily", "Kilo-kilo", "Kiñaman", "Labo", "Lamesa", "Landy", "Lapu-lapu Poblacion", "Libjo", "Lipa", "Lusok", "Maharlika Poblacion", "Makulapnit", "Maniwaya", "Manlibunan", "Masaguisi", "Masalukot", "Matalaba", "Mongpong", "Morales", "Napo", "Pag-asa Poblacion", "Pantayin", "Polo", "Pulong-Parang", "Punong", "San Antonio", "San Isidro", "Tagum", "Tamayo", "Tambangan", "Tawiran", "Taytay"],
    Gasan: ["Antipolo", "Bachao Ibaba", "Bachao Ilaya", "Bacongbacong", "Bahi", "Bangbang", "Banot", "Banuyo", "Barangay I", "Barangay II", "Barangay III", "Bognuyan", "Cabugao", "Dawis", "Dili", "Libtangin", "Mahunig", "Mangiliol", "Masiga", "Matandang Gasan", "Pangi", "Pingan", "Tabionan", "Tapuyan", "Tiguion"],
    Buenavista: ["Bagacay", "Bagtingon", "Barangay I", "Barangay II", "Barangay III", "Barangay IV", "Bicas-bicas", "Caigangan", "Daykitin", "Libas", "Malbog", "Sihi", "Timbo", "Tungib-Lipata", "Yook"],
    Torrijos: ["Bangwayin", "Bayakbakin", "Bolo", "Bonliw", "Buangan", "Cabuyo", "Cagpo", "Dampulan", "Kay Duke", "Mabuhay", "Makawayan", "Malibago", "Malinao", "Maranlig", "Marlangga", "Matuyatuya", "Nangka", "Pakaskasan", "Payanas", "Poblacion", "Poctoy", "Sibuyao", "Suha", "Talawan", "Tigwi"]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!formData.agreeToTerms) {
      toast.error("Please agree to the Terms and Conditions");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          zipCode,
        }),
      });

      const data = await response.json();
      if (!data || !data._id) {
        throw new Error("No user ID received from server");
      }

      const userId = data._id;
      toast.success("Sign up successful! Redirecting...");
      navigate(`/verify-email/${userId}`);
    } catch (error) {
      console.error("Sign up error:", error.message);
      toast.error(error.message || "Sign up failed");
    }
  };

  return (
    <>
      <Header /> {/* Add Header */}
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-full max-w-4xl p-8 mx-4 md:mx-auto bg-white shadow-lg rounded-lg flex flex-col md:flex-row border-4 border-green-200">
          {/* Left side with background image */}
          <div
            className="hidden md:flex md:w-1/2 items-center bg-contain rounded-l-lg"
            style={{ backgroundImage: `url('/landingimage/Buynow.png')` }}
          >
            <div className="flex items-center justify-center w-full bg-gray-500 bg-opacity-50 p-8 rounded-l-lg">
              <div className="text-center text-black">
                <h2 className="text-4xl font-bold mb-4">Sign Up</h2>
                <p className="text-lg">
                  Please enter your details to sign up and be part of our great community.
                </p>
              </div>
            </div>
          </div>
          {/* Right side with form */}
          <div className="w-full md:w-1/2 p-8">
            <h1 className="text-center font-semibold my-7 text-3xl">
              Welcome to Muebles!
            </h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
                    className="bg-slate-100 p-3 rounded-lg "
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
              <input
                type="password"
                placeholder="Password"
                id="password"
                required
                className="bg-slate-100 p-3 rounded-lg"
                onChange={handleChange}
                value={formData.password}
              />
              <input
                type="password"
                placeholder="Confirm password"
                id="confirmPassword"
                required
                className="bg-slate-100 p-3 rounded-lg"
                onChange={handleChange}
                value={formData.confirmPassword}
              />
              <div className="inline-flex items-center">
                <label className="flex items-center cursor-pointer relative" htmlFor="agreeToTerms">
                  <input
                    type="checkbox"
                    className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                    id="agreeToTerms"
                    onChange={handleChange}
                    checked={formData.agreeToTerms}
                  />
                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                      stroke="currentColor" strokeWidth="1">
                      <path fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"></path>
                    </svg>
                  </span>
                </label>
                <label className="cursor-pointer ml-2 text-slate-600 text-sm" htmlFor="agreeToTerms">
                  I agree to the <Link to="/terms" className="text-blue-500">Terms and Conditions</Link>
                </label>
              </div>
              <button
                type="submit"
                className="p-3 bg-green-600 rounded-lg text-white font-bold uppercase hover:bg-green-500"
              >
                Sign up
              </button>
              <div>
                <p>
                  Already have an account?{" "}
                  <Link to="/login">
                    <span className="text-blue-500">Log in</span>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer /> {/* Add Footer */}
    </>
  );
}



