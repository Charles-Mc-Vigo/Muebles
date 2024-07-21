import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const token = localStorage.getItem('userToken');
  
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;