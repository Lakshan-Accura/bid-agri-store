// App.tsx
import './App.css';
import { Route, Routes } from 'react-router-dom';
import FarmerLogin from './logins/farmerLogin';
import AgriStoreLogin from './logins/storeLogin';
import FarmerDashboard from './dashboards/farmerDashboard';
import StoreDashboard from './dashboards/storeDashboard';
import MainLayout from './mainLayout';
import FarmerSignup from './logins/farmerSignup';
import Profile from './profile/profile';
import ProtectedRoute from './protectedRoute';
import NotFoundPage from './notFoundPage';
import EmailVerification from './EmailVerification';
import EmailSendPage from './ResendEmailPage';

function App() {
  return (
    <Routes>
      {/* 🌐 Public routes */}
      <Route path="/farmerLogin" element={<FarmerLogin />} />
      <Route path="/farmerSignup" element={<FarmerSignup />} />
      <Route path="/storeLogin" element={<AgriStoreLogin />} />

      {/* 🔒 Protected routes with role-based access */}
      <Route
        path="/"
        element={
            <MainLayout />
        }
      />
      
      {/* Store Dashboard - Only accessible to TENANT_ADMIN */}
      <Route
        path="/storeDashboard"
        element={
          <ProtectedRoute requiredRoles={['TENANT_ADMIN']}>
            <StoreDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Farmer Dashboard - Only accessible to SYSTEM_USER */}
      <Route
        path="/farmerDashboard"
        element={
          <ProtectedRoute requiredRoles={['SYSTEM_USER']}>
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Profile - Accessible to both roles */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="/email-verification" element={<EmailVerification />} />

      <Route path="/send-email" element={<EmailSendPage />} />



      
 {/* 🚫 404 Page - Catch all route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;