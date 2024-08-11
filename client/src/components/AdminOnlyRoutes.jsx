import React from 'react'

const AdminOnlyRoutes = ({ element: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('adminToken');

  return isAuthenticated ? (
      Component
  ) : (
      <Navigate to="/admin" replace />
  );
}

export default AdminOnlyRoutes