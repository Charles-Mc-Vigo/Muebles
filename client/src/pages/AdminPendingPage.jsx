import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPendingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { message } = location.state || {};

    const approvalStatus = "Accepted"; 

    useEffect(() => {
        switch (approvalStatus) {
            case "Pending":
                toast.info('Your request is still pending.');
                break;
            case "Accepted":
                toast.success('Your request has been approved!');
                setTimeout(() => navigate('/dashboard'), 3000);
                break;
            case "Rejected":
                toast.error('Your request was rejected.');
                setTimeout(() => navigate('/admin-signup'), 3000); 
                break;
            default:
                toast.warn('Unknown status.');
        }
    }, [approvalStatus, navigate]);

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
            <ToastContainer />
        </div>
    );
};

export default AdminPendingPage;
