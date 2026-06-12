import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingState from './LoadingState';

export default function RoleRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="route-loading">
        <LoadingState count={1} />
        <p>Verifying security permissions...</p>
      </div>
    );
  }

  if (!user) {
    // Preserve the originally requested path so Login can redirect back
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
