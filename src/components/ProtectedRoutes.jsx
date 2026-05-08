import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/usercontext';

export default function ProtectedRoutes({ children, rol }) {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (rol && user.rol !== rol) {
    return <Navigate to="/" replace />;
  }

  return children;
}
