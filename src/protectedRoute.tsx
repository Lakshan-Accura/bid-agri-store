// src/protectedRoute.tsx
import React, { useEffect } from 'react';
import { useAuthStore } from './authStore';
import { useNavigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string | string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const {
    isAuthenticated,
    isLoading,
    checkAuth,
    hasRole,
    hasTenantAdminRole,
    hasFarmerRole,
  } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();

  // Get dashboard route based on roles
  const getDashboardRoute = () => {
    if (hasTenantAdminRole()) return '/storeDashboard';
    if (hasFarmerRole()) return '/farmerDashboard';
    return '/';
  };

  // ✅ Run auth check on mount
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Handle redirects after auth state is known
  useEffect(() => {
    if (isLoading) return; // Wait for auth check

    // ❌ Not authenticated → go to login
    if (!isAuthenticated) {
      navigate('/', { replace: true, state: { from: location.pathname } });
      return;
    }

    // 🔄 Redirect from root path to dashboard if logged in
    if (location.pathname === '/') {
      const dashboardRoute = getDashboardRoute();
      if (dashboardRoute !== location.pathname) {
        navigate(dashboardRoute, { replace: true });
      }
      return;
    }

    // ❌ Role mismatch → redirect to dashboard
    if (requiredRoles && !hasRole(requiredRoles)) {
      const dashboardRoute = getDashboardRoute();
      if (dashboardRoute !== location.pathname) {
        navigate(dashboardRoute, {
          replace: true,
          state: { message: 'Access denied. You do not have permission to access this page.' },
        });
      }
      return;
    }
  }, [
    isAuthenticated,
    isLoading,
    requiredRoles,
    hasRole,
    navigate,
    location,
    hasTenantAdminRole,
    hasFarmerRole,
  ]);

  // 🌀 Show loading spinner while auth check is in progress
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>Checking authentication...</div>
      </div>
    );
  }

  // 🚫 Access denied screen for role mismatch
  if (requiredRoles && !hasRole(requiredRoles)) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>Access Denied. You don't have permission to view this page.</div>
      </div>
    );
  }

  // ✅ Authenticated + authorized → render children
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
