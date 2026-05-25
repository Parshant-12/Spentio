import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Check if the JWT exists in the browser's local storage
  const isAuthenticated = localStorage.getItem('token');

  // If the token exists, render the requested page (Outlet)
  // If not, redirect them to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;