import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, admin = false }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const token = localStorage.getItem('userToken');
  
  if (!isAuthenticated || !token) {
    return <Navigate to={admin ? "/dashboard" : "/login"} />;
  }
  
  return children;
};

export default ProtectedRoute;
