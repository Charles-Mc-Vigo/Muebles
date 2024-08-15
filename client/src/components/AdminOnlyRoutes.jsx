import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const AdminOnlyRoutes = ({ element: Component, ...rest }) => {
	const token = Cookies.get("authToken");
	const isAuthenticated = !!token;

  return isAuthenticated ? (
		<Component {...rest} />
  ) : (
      <Navigate to="/admin" replace />
  );
}

export default AdminOnlyRoutes