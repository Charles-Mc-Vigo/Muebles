import React, { useState, useEffect } from "react";

const AdminEditProfile = () => {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        role: "",
        avatarUrl: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/admin/setting/my-profile/view", {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) throw new Error("Failed to load profile");

                const data = await response.json();
                setProfile({
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    avatarUrl: data.avatarUrl,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setProfile((prevProfile) => ({
                ...prevProfile,
                avatarUrl: reader.result,
            }));
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3000/api/admin/setting/update-profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(profile),
            });
            if (!response.ok) throw new Error("Failed to save changes");

            setSuccess("Profile updated successfully!");
            setError(null);
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg w-96 mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
            {success && <p className="text-green-500 mb-4">{success}</p>}

            <div className="flex flex-col items-center mb-6">
                <img
                    src={profile.avatarUrl || "/default-avatar.png"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mb-2 border-2 border-gray-300"
                />
                <input type="file" onChange={handleImageUpload} className="text-sm text-gray-600" />
            </div>

            <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
            <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="mb-4 px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-teal-600"
            />

            <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="mb-4 px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-teal-600"
            />

            <label className="block mb-2 text-sm font-medium text-gray-700">Role</label>
            <input
                type="text"
                name="role"
                value={profile.role}
                onChange={handleInputChange}
                className="mb-4 px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-teal-600"
            />

            <button
                onClick={handleSaveChanges}
                className="w-full py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none"
            >
                Save Changes
            </button>
        </div>
    );
};

export default AdminEditProfile;
