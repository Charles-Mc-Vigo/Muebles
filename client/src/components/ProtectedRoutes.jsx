import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ element: Component, ...rest }) => {
	const token = Cookies.get("authToken");
	const isAuthenticated = !!token;

	return isAuthenticated ? (
		Component
	) : (
		<Navigate to="/login" replace />
	);
};

export default ProtectedRoute;
