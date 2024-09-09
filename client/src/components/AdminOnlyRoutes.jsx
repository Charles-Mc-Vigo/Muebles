import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const AdminOnlyRoutes = ({ element: Component, ...rest }) => {
	const adminToken = Cookies.get("adminToken");
	const isAuthenticated = !!adminToken;

  return isAuthenticated ? (
		Component
  ) : (
      <Navigate to="/admin-login" replace />
  );
}

export default AdminOnlyRoutes