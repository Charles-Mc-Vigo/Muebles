import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faCog, faTimes } from "@fortawesome/free-solid-svg-icons";  // Import necessary icons

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);  // State to toggle the sidebar
    const menuRef = useRef(null); // Reference for the sidebar

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    // Close the menu when pressing the Esc key
    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            menuRef.current.focus(); // Focus on the menu when it opens
        }
    }, [isOpen]);

    return (
        <div>
            {/* Button to toggle the sidebar, showing either the hamburger or close icon */}
            <button onClick={toggleMenu} className="p-2 focus:outline-none" aria-label="Toggle menu">
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
            </button>

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}
                tabIndex="-1" // Make it focusable
                ref={menuRef}
                onKeyDown={handleKeyDown} // Handle keydown events
            >
                <ul className="space-y-4 mt-8 p-4">
                    {/* Profile */}
                    <li>
                        <button className="focus:outline-none flex items-center hover:bg-gray-100 rounded-md p-2 transition">
                            <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
                        </button>
                    </li>
                    {/* Settings */}
                    <li>
                        <button className="focus:outline-none flex items-center hover:bg-gray-100 rounded-md p-2 transition">
                            <FontAwesomeIcon icon={faCog} className="mr-2" /> Settings
                        </button>
                    </li>
                </ul>
            </div>

            {/* Overlay to close sidebar */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40"
                    onClick={toggleMenu}
                    aria-label="Close menu overlay"
                    role="button" // Make it clickable
                    tabIndex="0" // Make it focusable
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
