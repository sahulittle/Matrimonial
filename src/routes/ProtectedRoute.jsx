import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - Role-based route protection component
 * 
 * @param {string[]} allowedRoles - Array of roles that can access this route
 * @param {string} redirectPath - Where to redirect if not authorized (default: /login)
 */
const ProtectedRoute = ({ allowedRoles, redirectPath = '/login' }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show nothing while auth state is loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
            </div>
        );
    }

    // Not logged in → redirect to login
    if (!user) {
        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    // Logged in but wrong role → redirect to unauthorized
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Authorized → render child routes
    return <Outlet />;
};

export default ProtectedRoute;
