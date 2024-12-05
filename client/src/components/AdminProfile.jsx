import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

const AdminProfile = ({ showNameAndImage }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/admin/setting/my-profile/view",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to load profile");
                }
                const data = await response.json();
                setProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <p className="text-center text-lg">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-10">
            <div className="flex items-center mb-6 cursor-pointer" onClick={() => navigate("/dashboard")}>
                <IoIosArrowBack className="text-2xl text-gray-600 mr-2" />
                <span className="text-lg text-gray-600">Back</span>
            </div>

            <div className="flex items-center gap-6">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                    {profile?.image ? (
                        <img
                            src={
                                profile.image.startsWith("data:")
                                    ? profile.image
                                    : profile.image
                            }
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                        </div>
                    )}
                </div>

            </div>

            {/* Profile Details */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <p className="text-lg font-medium text-gray-900 mt-1">
                        {profile.role}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-600">Full Name</label>
                    <p className="text-lg font-medium text-gray-900 mt-1">
                        {`${profile.firstname} ${profile.lastname}`}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-600">Email Address</label>
                    <p className="text-lg font-medium text-gray-900 mt-1">
                        {profile.email}
                    </p>
                    <label className="inline-flex items-center mt-2">
                        <input type="checkbox" className="form-checkbox" />
                        <span className="ml-2 text-sm text-gray-600">Receive marketing emails</span>
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-600">Mobile</label>
                    <p className="text-lg font-medium text-gray-900 mt-1">
                        {profile.phoneNumber}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-600">Gender</label>
                    <p className="text-lg font-medium text-gray-900 mt-1">
                        {profile.gender || "Not specified"}
                    </p>
                </div>
            </div>

            {/* Edit Profile Button */}
            <div className="mt-8">
                <Link to="/dashboard/setting/admin-profile/edit">
                    <button className="w-full bg-teal-500 text-white text-lg py-3 rounded-lg hover:bg-teal-600 transition duration-150">
                        Edit Profile
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default AdminProfile;