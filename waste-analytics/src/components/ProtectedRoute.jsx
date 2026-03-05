import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 * adminOnly: if true, only admins can access — guests get redirected to /5s-system/awareness
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isLoggedIn, isGuest } = useAuth();
    const location = useLocation();

    // Not logged in at all → go to login
    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Guest trying to access an admin-only page
    if (adminOnly && isGuest) {
        return <Navigate to="/5s-system/awareness" replace />;
    }

    return children;
};

export default ProtectedRoute;
