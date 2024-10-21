import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";

const Profile = ({ showNameAndImage }) => {
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
        <div className="flex border-2 mt-10 ">
            {/* Sidebar */}
            <aside className="w-1/5 p-4 border-r-2">
                <nav className="space-y-4">
                    <div className="flex flex-col items-start mb-5">
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
                        <h2 className="text-lg font-semibold">
                            {profile.firstname} {profile.lastname}
                        </h2>
                        <p className="text-gray-600">{profile.role}</p>
                        <div className="flex items-center">
                            <p className="text-2xl"><CiEdit /></p>
                            <Link to="edit-profile" className="text-gray-600 flex-row flex space-x-4">
                                <span>Edit Profile</span>
                            </Link>
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Profile Details */}
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">My Profile</h1>
                <p className="text-gray-500 mb-6 border-b-2 border-black">Manage and protect your account</p>
                
                <div className="flex items-start gap-8">
                    <div className="flex-1">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <div className="w-full p-2 border rounded mt-1 bg-gray-100">
                                    {`${profile.firstname} ${profile.lastname}`}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Role</label>
                                <div className="w-full p-2 border rounded mt-1 bg-gray-100">
                                    {profile.role}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <div className="w-full p-2 border rounded mt-1 bg-gray-100">
                                    {profile.email}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Phone Number</label>
                                <div className="w-full p-2 border rounded mt-1 bg-gray-100">
                                    {profile.phoneNumber}
                                </div>
                                <p className="text-gray-500 mt-1">
                                    Link your phone number to your account.
                                </p>
                            </div>
                        </div>
						<Link to="">
						<button className="mt-5 bg-oliveGreen text-white px-4 py-2 rounded" >
                            Edit
                        </button>
						</Link>
                        
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
