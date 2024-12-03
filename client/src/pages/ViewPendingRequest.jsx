import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const ViewPendingRequest = () => {
  const { adminId } = useParams();
  const [requestingAdmin, setRequestingAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      const response = await fetch(
        `http://localhost:3000/api/admin/notifications/accept-request/${adminId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to accept request");
        return;
      }
      alert(`${requestingAdmin.firstname}'s request was approved!`);
      fetchRequestingAdmin();
    } catch (error) {
      console.log("Error accepting admin request: ", error);
      alert("Failed to accept admin request: " + error.message);
    }
  };

  const RejectAdminRequest = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/notifications/reject-request/${adminId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to reject request");
        return;
      }
      alert(`${requestingAdmin.firstname}'s request was rejected!`);
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
    <div className="flex mt-10  mx-5">
      {/* Left Navigation Section */}
      <div className="w-1/7 p-5 bg-green-700 ">
        <div className="flex flex-col items-start p-5 m-5">
          <img
            src="/landingimage/LOGO.jpg"
            alt="LOGO"
            className="w-20 h-20 rounded-full object-contain"
          />
          <h1 className="mt-3">JCKAME</h1>
        </div>
      </div>

      {/* Right Content Section */}
      <div className="w-5/6 p-5 bg-white">
        <div className="w-5/6 p-5 bg-white">
          <div className="flex">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-wh-500 mr-2 hover:text-green-600"
            >
              <IoMdArrowRoundBack size={30} />
            </button>
            <h1 className="text-2xl font-bold">Pending Requests</h1>
          </div>

          <div className="mt-4 p-5 border-t border-green-600">
            <table className="min-w-full border-collapse border border-green-600">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="border border-green-600 p-2">Field</th>
                  <th className="border border-green-600 p-2">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-green-600 p-2">Firstname</td>
                  <td className="border border-green-600 p-2">
                    {requestingAdmin.firstname}
                  </td>
                </tr>
                <tr>
                  <td className="border border-green-600 p-2">Lastname</td>
                  <td className="border border-green-600 p-2">
                    {requestingAdmin.lastname}
                  </td>
                </tr>
                <tr>
                  <td className="border border-green-600 p-2">Gender</td>
                  <td className="border border-green-600 p-2">
                    {requestingAdmin.gender}
                  </td>
                </tr>
                <tr>
                  <td className="border border-green-600 p-2">Phone Number</td>
                  <td className="border border-green-600 p-2">
                    {requestingAdmin.phoneNumber}
                  </td>
                </tr>
                <tr>
                  <td className="border border-green-600 p-2">Email</td>
                  <td className="border border-green-600 p-2">
                    {requestingAdmin.email}
                  </td>
                </tr>
                <tr>
                  <td className="border border-green-600 p-2">Admin request</td>
                  <td className="border border-green-600 p-2">
                    {requestingAdmin.adminApproval}
                  </td>
                </tr>
                <div className="m-2 flex gap-2">
                  <button
                    onClick={AcceptAdminRequest}
                    className="p-2 text-base border rounded-md border-green-700 text-black-700 bg-transparent hover:bg-green-800 hover:text-white"
                  >
                    Accept
                  </button>
                  <button
                    onClick={RejectAdminRequest}
                    className="p-2 border rounded-md border-gray-300 text-white bg-red-700 hover:bg-red-400"
                  >
                    Reject
                  </button>
                </div>
              </tbody>
            </table>
            <div className=" m-5 p-5 border border-green-700">
              <h2>
                This admin is requesting for admin role and waiting for
                approval.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPendingRequest;
