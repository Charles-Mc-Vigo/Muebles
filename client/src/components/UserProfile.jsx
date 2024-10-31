import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Footer from "./Footer";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [zipCode, setZipCode] = useState("");
  const [availableBarangays, setAvailableBarangays] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
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
    // ... (your barangays data)
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/setting/my-profile/view", {
        method: "GET",
        credentials: "include",
      });
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
      setFormData((prev) => ({ ...prev, barangay: "" })); // Reset barangay when municipality changes
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
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

      const response = await fetch("http://localhost:3000/api/users/setting/my-profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": selectedImage ? "multipart/form-data" : "application/json",
        },
        body: selectedImage ? createFormData(dataToUpdate) : JSON.stringify(dataToUpdate),
        credentials: "include",
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Update failed");
      }
      setProfile(responseData.user);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred. Please try again.");
    }
  };

  const createFormData = (data) => {
    const formData = new FormData();
    formData.append("image", selectedImage);
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    return formData;
  };

  if (loading) return <p className="text-center text-lg">Loading your profile...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!profile) return <p className="text-center text-red-500">Profile data not available.</p>;

  return (
    <div>
      <Header />
      <div className="max-w-3xl mx-auto m-4 p-6 bg-white border-2  rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          {isEditing ? "Edit Profile" : "Profile Details"}
        </h1>
        <div className="flex flex-col items-center">
          <Link to="/dashboard/setting/my-profile/view" className="group mt-4">
            <img
              src={profile.image || "default-profile-image.jpg"}
              alt={`${profile.firstname} ${profile.lastname}'s Profile Picture`}
              className="w-24 h-24 rounded-full object-cover mb-4 shadow-lg transition-transform group-hover:scale-105"
            />
          </Link>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            {profile.firstname} {profile.lastname}
          </h2>
          <p className="text-sm font-medium text-gray-600 mb-2">{profile.role}</p>
          <div className="text-center text-gray-700 space-y-1">
            <p>Email: {profile.email}</p>
            <p>Phone: {profile.phoneNumber}</p>
            <p>
              Address: {`${profile.streetAddress}, ${profile.barangay}, ${profile.municipality}, ${profile.zipCode}`}
            </p>
          </div>
          <button onClick={handleEditToggle} className="bg-yellow-500 text-white px-4 py-2 rounded mt-4">
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
        {isEditing && (
          <form onSubmit={handleSave} className="flex flex-col gap-4 mt-6">
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
              className="w-full bg-green-800 hover:bg-green-600 text-white p-3 rounded-lg font-semibold"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default UserProfile;