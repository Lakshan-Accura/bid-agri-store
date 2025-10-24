import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import './App.css';
import Home from './home/home';
import Login from './login/login';
import Profile from './profile/profile';
import UsersPage from './users/userPage';
import ProductPage from './product/productPage';
import ProtectedRoute from './protectedRoute';
import 'antd/dist/reset.css';
import ResetPasswordForm from './passwordReset/ResetPasswordForm';
import SendResetEmail from './passwordReset/SendResetEmail';
import TenantPage from './tenants/tenantPage';
import AddTenantAdminForm from './tenants/AddTenantAdminForm';

function App() {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/forgot-password',
      element: <SendResetEmail />
    },
    {
      path: '/reset-password',
      element: <ResetPasswordForm />
    },
    // REMOVE this route - ChangePassword is used as modal in Profile
    // {
    //   path: '/change-password',
    //   element: <ChangePassword />
    // },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      )
    },
    {
      path: '/profile',
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      )
    },
    {
      path: '/products',
      element: (
        <ProtectedRoute>
          <ProductPage />
        </ProtectedRoute>
      )
    },
    {
      path: '/users',
      element: (
        <ProtectedRoute>
          <UsersPage />
        </ProtectedRoute>
      )
    },
    {
      path: '/tenants',
      element: (
        <ProtectedRoute>
          <TenantPage />
        </ProtectedRoute>
      )
    },
     {
    path: '/AddTenantAdminForm',
    element: <AddTenantAdminForm />
  },
    {
      path: '/',
      element: <Login />
    },


    {
      path: '*',
      element: (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column'
        }}>
          <h1>404 - Page Not Found</h1>
          <a href="/login">Go to Login</a>
        </div>
      )
    }
  ]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </ConfigProvider>
  );
}

export default App;