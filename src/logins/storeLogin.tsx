import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Spin, message } from 'antd';
import { UserOutlined, LockOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authApi, tokenUtils, type LoginRequest } from '../apiEndpoints/login';
import MainLayout from '../mainLayout';
import './storeLogin.css';

const { Title, Text } = Typography;

const AgriStoreLogin: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Check if user has TENANT_ADMIN role
  const hasStoreAccess = (): boolean => {
    return tokenUtils.hasTenantAdminRole();
  };

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    setErrorMessage('');

    try {
      console.log('Agri Store login attempt:', values);

      // Login API call
      const response = await authApi.login(values);
      console.log('Login response received');

      if (response.payload?.jwtToken) {
        console.log('JWT Token received and stored by tokenUtils');

        // Check user role
        if (!hasStoreAccess()) {
          const decodedToken = tokenUtils.getDecodedToken();
          const userRoles = decodedToken?.roles?.join(', ') || 'No roles assigned';
          tokenUtils.clearTokens(); // Clear invalid tokens
          throw new Error(`Access denied. Your role(s): ${userRoles}. Only TENANT_ADMIN can access the store dashboard.`);
        }

        // Store username
        localStorage.setItem('userName', values.userName);

        message.success('Login successful! Redirecting to store dashboard...');

        // ✅ Navigate to dashboard after token is set
        setTimeout(() => {
          navigate('/storeDashboard', { replace: true });
        }, 300); // small delay fixes first-time reload issue
      } else {
        throw new Error(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'An error occurred during login. Please try again.');
      message.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* Background Image - scrolls with page */}
      <div className="agri-store-login-background"></div>
      
      {/* Background Overlay - scrolls with page */}
      <div className="agri-store-login-overlay"></div>

      <div className="agri-store-login-page">
        <Card className="agri-store-login-card">
          <div className="agri-store-header">
            <div className="agri-store-icon">
              <ShopOutlined style={{ fontSize: 28, color: 'white' }} />
            </div>
            <Title level={3} className="agri-store-title">
              Agri Store Login
            </Title>
            <Text className="agri-store-subtitle">Access your store dashboard</Text>
          </div>

          {errorMessage && (
            <Alert
              message="Login Error"
              description={errorMessage}
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
              closable
              onClose={() => setErrorMessage('')}
            />
          )}

          <Form
            name="agri-store-login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            className="agri-store-form"
            disabled={loading}
          >
            <Form.Item
              label="Username or Email"
              name="userName"
              rules={[{ required: true, message: 'Please input your username or email!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter username or email"
                size="large"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                size="large"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="agri-store-button"
                icon={<UserOutlined />}
              >
                {loading ? 'Logging in...' : 'Login to Store Dashboard'}
              </Button>
            </Form.Item>

            {loading && (
              <div style={{ textAlign: 'center', margin: '16px 0' }}>
                <Spin size="large" />
                <Text style={{ display: 'block', marginTop: 8, color: '#666' }}>
                  Authenticating, please wait...
                </Text>
              </div>
            )}
          </Form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Only TENANT_ADMIN roles can access the store dashboard
            </Text>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AgriStoreLogin;