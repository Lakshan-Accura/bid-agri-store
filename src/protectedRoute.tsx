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
    hasFarmerRole 
  } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the appropriate dashboard route based on user role
  const getDashboardRoute = () => {
    if (hasTenantAdminRole()) {
      return '/storeDashboard';
    } else if (hasFarmerRole()) {
      return '/farmerDashboard';
    }
    return '/';
  };

  // ✅ Run checkAuth only once (on mount)
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Handle redirects only when auth state changes
  useEffect(() => {
    if (isLoading) return;

    // 🔒 Not authenticated → go to login
    if (!isAuthenticated) {
      navigate('/', {
        replace: true,
        state: { from: location.pathname },
      });
      return;
    }

    // ❌ Role mismatch → redirect to their own dashboard
    if (requiredRoles && !hasRole(requiredRoles)) {
      const dashboardRoute = getDashboardRoute();
      if (dashboardRoute !== location.pathname) {
        navigate(dashboardRoute, {
          replace: true,
          state: {
            message: 'Access denied. You do not have permission to access this page.',
          },
        });
      }
    }

    // 🔄 Auto-redirect to appropriate dashboard for root path
    if (location.pathname === '/' && isAuthenticated) {
      const dashboardRoute = getDashboardRoute();
      navigate(dashboardRoute, { replace: true });
    }
  }, [
    isAuthenticated, 
    isLoading, 
    requiredRoles, 
    hasRole, 
    navigate, 
    location, 
    hasTenantAdminRole, 
    hasFarmerRole
  ]);

  // 🌀 Show loading screen while checking auth
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

  // 🚫 Role restriction display (optional)
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

  // ✅ Authenticated + authorized → render content
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;