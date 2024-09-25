import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;