import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faCog, faSignOutAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
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

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div>
            <button onClick={toggleMenu} className="text-gray-800 p-2">
                <FontAwesomeIcon icon={faBars} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="bg-black bg-opacity-50 w-full h-full" onClick={toggleMenu}></div>
                    <div className="relative bg-white w-64 p-4 shadow-lg z-50" style={{ animation: "slideIn 0.3s forwards" }}>
                        <button onClick={toggleMenu} className="absolute top-4 right-4 text-gray-600">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>

                        <div className="flex flex-col items-center mb-6">
                            {loading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : profile ? (
                                <div className="text-center">
                                    <p className="text-lg font-semibold mb-2">JCKAME</p>
                                    <img
                                        src={profile?.avatarUrl || "/default-avatar.png"}
                                        alt="Profile"
                                        className="w-20 h-20 rounded-full mb-2"
                                    />
                                    <p className="text-sm text-gray-500">{profile.role}</p>
                                </div>
                            ) : null}
                        </div>

                        <nav className="space-y-4">
                            <Link to="/profile" className="flex items-center space-x-2 text-gray-700">
                                <FontAwesomeIcon icon={faUser} />
                                <span>Profile</span>
                            </Link>
                            <Link to="/dashboard/setting/admin-profile/view" className="flex items-center space-x-2 text-gray-700">
                                <FontAwesomeIcon icon={faCog} />
                                <span>Settings</span>
                            </Link>
                            <Link to="/logout" className="flex items-center space-x-2 text-gray-700">
                                <FontAwesomeIcon icon={faSignOutAlt} />
                                <span>Logout</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;
