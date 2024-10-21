import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faCog, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
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

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            menuRef.current.focus();
        }
    }, [isOpen]);

    return (
        <div>
            <button onClick={toggleMenu} className="p-2 focus:outline-none" aria-label="Toggle menu">
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
            </button>

            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}
                tabIndex="-1"
                ref={menuRef}
            >
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : (
                    <ul className="space-y-4 mt-8 p-4">
                        <div className="flex flex-col items-center mb-5">
                            {profile.image ? (
                                <img
                                    src={profile.image}
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
                        </div>
                        <li>
                            <button className="focus:outline-none flex items-center hover:bg-gray-100 rounded-md p-2 transition">
                                <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
                            </button>
                        </li>
                        <Link to="setting/my-profile/view">
                        <button className="focus:outline-none flex items-center hover:bg-gray-100 rounded-md p-2 transition">
                                <FontAwesomeIcon icon={faCog} className="mr-2" /> Settings
                            </button>
                        </Link>
                       
                    </ul>
                )}
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40"
                    onClick={toggleMenu}
                    aria-label="Close menu overlay"
                    role="button"
                    tabIndex="0"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            toggleMenu();
                        }
                    }}
                ></div>
            )}
        </div>
    );
};

export default HamburgerMenu;
