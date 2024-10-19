import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const Authentication = ({ children, adminRoute = false, publicAdminRoute = false }) => {
  const location = useLocation();
  const adminToken = Cookies.get('adminToken');
  const authToken = Cookies.get('authToken');

  // For admin login and signup pages
  if (publicAdminRoute) {
    if (adminToken) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  }

  // For admin routes
  if (adminRoute) {
    if (!adminToken) {
      return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }
    return children;
  }

  // For user routes
  if (!authToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default Authentication;