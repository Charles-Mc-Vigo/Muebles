import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const Notification = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNotification = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <button
                onClick={toggleNotification}
                className="relative p-2 focus:outline-none"
            >
                <FontAwesomeIcon icon={faBell} size="lg" />
                {/* Dummy Notification Badge */}
                <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-[300px] bg-white shadow-lg rounded-lg p-4 z-50 max-h-64 overflow-y-auto">
                    <h4 className="font-bold mb-2">Notifications</h4>
                    <ul className="text-sm">
                        <li className="mb-1">You have a new message</li>
                        <li className="mb-1">Product XYZ was updated</li>
                        <li className="mb-1">Your order is being processed</li>
                        <li className="mb-1">You have a new message</li>
                        <li className="mb-1">Product XYZ was updated</li>
                        <li className="mb-1">Your order is being processed</li>
                        <li className="mb-1">You have a new message</li>
                        <li className="mb-1">Product XYZ was updated</li>
                        <li className="mb-1">Your order is being processed</li>
                        <li className="mb-1">You have a new message</li>
                        <li className="mb-1">Product XYZ was updated</li>
                        <li className="mb-1">Your order is being processed</li>
                        <li className="mb-1">You have a new message</li>
                        <li className="mb-1">Product XYZ was updated</li>
                        <li className="mb-1">Your order is being processed</li>
                        <li className="mb-1">You have a new message</li>
                        <li className="mb-1">Product XYZ was updated</li>
                        <li className="mb-1">Your order is being processed</li>
                        <li className="mb-1">You have a new message</li>
                        <li className="mb-1">Product XYZ was updated</li>
                        <li className="mb-1">Your order is being processed</li>
                        <li className="mb-1">You have a new message</li>
                        <li className="mb-1">Product XYZ was updated</li>
                        <li className="mb-1">Your order is being processed</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Notification;
