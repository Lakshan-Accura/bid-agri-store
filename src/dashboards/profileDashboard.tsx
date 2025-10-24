// protectedProfileDashboard.tsx
import React from 'react';
import { useAuthStore } from '../authStore';
import { Navigate } from 'react-router-dom';
import StoreDashboard from './storeDashboard';
import FarmerDashboard from './farmerDashboard';
import Profile from '../profile/profile';

function ProtectedProfileDashboard() {
  const { isAuthenticated, hasTenantAdminRole, hasFarmerRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (hasTenantAdminRole()) {
    return (
      <StoreDashboard>
        <Profile />
      </StoreDashboard>
    );
  }

  if (hasFarmerRole()) {
    return (
      <FarmerDashboard>
        <Profile />
      </FarmerDashboard>
    );
  }

  // If user doesn't have required roles, redirect to appropriate login
  return <Navigate to="/" replace />;
}

export default ProtectedProfileDashboard;