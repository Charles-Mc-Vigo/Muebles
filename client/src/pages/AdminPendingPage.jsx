import React from 'react';
import { useLocation } from 'react-router-dom';

const AdminPendingPage = () => {
    const location = useLocation();
    const { message } = location.state || {};

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-lg text-center">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">
                    Pending Admin Request
                </h1>
                {message ? (
                    <p className="text-lg text-gray-600">{message}</p>
                ) : (
                    <p className="text-lg text-gray-400">
                        No message available.
                    </p>
                )}
            </div>
        </div>
    );
};

export default AdminPendingPage;
