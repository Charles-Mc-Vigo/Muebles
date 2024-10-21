import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const UserProfileView = () => {
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john@example.com",
    address: "1234 Elm Street",
    phoneNumber: "123-456-7890",
    password: "",
    profilePicture: "https://www.pngarts.com/files/10/Default-Profile-Picture-Transparent-Image.png", // Default profile picture
  });

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle profile picture change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prevData) => ({
          ...prevData,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to save updated data (e.g., send to a server)
    console.log("Updated user data:", userData);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - Full width */}
      <header className="w-full">
        <Header />
      </header>

      {/* Main content - Centered form */}
      <main className="flex-grow flex justify-center items-center p-4 bg-gray-100">
        <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

          {/* Form to edit user profile */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <img
                src={userData.profilePicture}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover mb-4"
              />
              <input
                type="file"
                onChange={handleFileChange}
                className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={userData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter new password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Save Changes
            </button>
          </form>
        </div>
      </main>

      {/* Footer - Full width */}
      <footer className="w-full mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default UserProfileView;
