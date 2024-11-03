import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify 
import Header from "../components/Header";
import Footer from "../components/Footer";

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
    agreeToTerms: false, // Changed to false for proper checkbox handling
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
      if (!response.ok) {
        throw new Error(data.message || "Sign up failed");
      }
      if (!data.newUser || !data.newUser._id) {
        throw new Error("Invalid response from server");
      }
      toast.success(data.message || "Sign up successful! Please check your email to verify your account.");
      navigate(`/verify-account/${data.newUser._id}`);
    } catch (error) {
      console.error("Sign up error:", error.message);
      toast.error(error.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex justify-center items-center mb-3 mt-5">
        <div className="w-full max-w-4xl p-8 mx-4 md:mx-auto bg-white shadow-lg rounded-lg flex flex-col md:flex-row border-4 border-green-200">
          {/* Left side with background image */}
          <div
            className="hidden md:flex md:w-1/2 items-center bg-contain justify-center rounded-l-lg"
            style={{  backgroundImage: `url('/landingimage/signup.png')`,
              backgroundRepeat: "no-repeat", 
              backgroundPosition: "center", 
              backgroundSize: "contain", }}
          >
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
              <label className="italic text-xs">Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.</label>
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
                    ✔
                  </span>
                </label>
                <p className="pl-3 text-xs sm:text-sm">
                  I accept the&nbsp;
                  <Link to="/terms&condition" className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </Link>
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-green-800 hover:bg-green-600 text-white p-3 rounded-lg font-semibold"
              >
                Sign Up
              </button>
            </form>
            <div className="text-center mt-4">
              Already have an account?&nbsp;
              <Link to="/sign-in" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}