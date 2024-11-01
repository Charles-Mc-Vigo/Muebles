import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";

const AdminProfile = ({ showNameAndImage }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        <div className="flex mt-10">
            {/* Sidebar */}
            <aside className="w-1/4 p-4 border-r-2">
                <nav className="space-y-4">
                    <div className="flex flex-col items-center mb-5">
                        {profile.image ? (
                            <img
                                src={
                                    profile.image.startsWith("data:")
                                        ? profile.image
                                        : profile.image
                                }
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover mb-3"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                                <span className="text-gray-400">No Image</span>
                            </div>
                        )}
                        <h2 className="text-lg font-semibold text-center">
                            {profile.firstname} {profile.lastname}
                        </h2>
                        <p className="text-gray-600 text-center">{profile.role}</p>
                        <div className="flex items-center mt-3">
                            <CiEdit className="text-gray-600 mr-2" />
                            <Link to="/edit-profile" className="text-gray-600 hover:underline">
                                Edit Profile
                            </Link>
                        </div>
                    </div>
                </nav>
            </aside>

        </div>
    );
};

export default AdminProfile;
