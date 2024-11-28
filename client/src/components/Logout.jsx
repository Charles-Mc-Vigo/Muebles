import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiSignOut } from "react-icons/pi";

const Logout = ({ isAdmin, isUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      setLoading(true);

      try {
        if (isAdmin) {
          // Make a request to log out on the server-side, including credentials
          const response = await fetch(
            `http://localhost:3000/api/admin/logout`,
            {
              method: "POST",
              credentials: "include", // Ensure cookies are sent with the request
            }
          );

          if (!response.ok) {
            const data = await response.json(); // Get error message from response
            throw new Error(data.message || "Failed to log out. Please try again.");
          }

          // Redirect to the admin login page
          navigate("/admin-login");
        }

        if (isUser) {
          const response = await fetch(
            `http://localhost:3000/api/users/logout`,
            {
              method: "POST",
              credentials: "include", // Ensure cookies are sent with the request
            }
          );

          if (!response.ok) {
            const data = await response.json(); // Get error message from response
            throw new Error(data.message || "Failed to log out. Please try again.");
          }

          // Redirect to the user login page
          navigate("/login");
        }
      } catch (error) {
        console.error("Error logging out:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="logout-container">
      {error && <p className="text-red-500">{error}</p>}
      
      {/* Admin Logout Button */}
      {isAdmin && (
        <button
          onClick={handleLogout}
          disabled={loading}
          className={`flex items-center justify-center gap-2 bg-teal-600 text-black font-bold py-3 px-6 w-full rounded-lg shadow-lg hover:bg-teal-800 transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <PiSignOut className="text-xl" />
          <span>{loading ? "Logging out..." : "Logout"}</span>
        </button>
      )}

      {/* User Logout Button */}
      {isUser && (
        <span
          onClick={handleLogout}
          className="text-red-500  text-xl font-semibold cursor-pointer mr-2 "
        >
          {loading ? "Logging out..." : "Logout"}
        </span>
      )}
    </div>
  );
};

export default Logout;
