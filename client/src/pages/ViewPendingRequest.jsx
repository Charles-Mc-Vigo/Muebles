import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewPendingRequest = () => {
    const { adminId } = useParams();
    const [requestingAdmin, setRequestingAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch requesting admin data
    const fetchRequestingAdmin = async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/admin/notifications/pending-request/${adminId}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const requestingAdmin = await response.json();
            setRequestingAdmin(requestingAdmin);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch the data when the component mounts
    useEffect(() => {
        fetchRequestingAdmin();
    }, [adminId]);

    const AcceptAdminRequest = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/notifications/accept-request/${adminId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json(); // Parse the JSON response
            if (!response.ok) { // Check if the response is not OK
                alert(data.message || "Failed to accept request");
                return; // Exit early
            }
            console.log(data);
            alert(`${requestingAdmin.firstname}'s request was approved!`);
            // Refresh data after accepting the request
            fetchRequestingAdmin();
        } catch (error) {
            console.log("Error accepting admin request: ", error);
            alert("Failed to accept admin request: " + error.message);
        }
    };

    const RejectAdminRequest = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/notifications/reject-request/${adminId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            const data = await response.json(); // Parse the JSON response
            if (!response.ok) {
                alert(data.message || "Failed to reject request");
                return; // Exit early
            }
            alert(`${requestingAdmin.firstname}'s request was rejected!`);
            // Refresh data after rejecting the request
            fetchRequestingAdmin();
        } catch (error) {
            console.log("Error rejecting admin request: ", error);
            alert("Failed to reject admin request: " + error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <div>
            <h1>Pending Requests</h1>
            <div className="p-5 border-t border-red-700">
                <p>Firstname: {requestingAdmin.firstname}</p>
                <p>Lastname: {requestingAdmin.lastname}</p>
                <p>Gender: {requestingAdmin.gender}</p>
                <p>Phone Number: {requestingAdmin.phoneNumber}</p>
                <p>Email: {requestingAdmin.email}</p>
                <p>Admin request: {requestingAdmin.adminApproval}</p>
            </div>
            <div className="p-5 border border-blue-700">
                <h2>
                    This admin is requesting for admin role and waiting for approval.
                </h2>
            </div>
            <div>
                <button onClick={AcceptAdminRequest} className="p-5 border border-blue-700 text-blue-700 bg-transparent hover:bg-blue-700 hover:text-white">
                    Accept
                </button>
                <button onClick={RejectAdminRequest} className="p-5 border border-gray-300 text-white bg-red-700 hover:bg-red-400">
                    Reject
                </button>
            </div>
        </div>
    );
};

export default ViewPendingRequest;