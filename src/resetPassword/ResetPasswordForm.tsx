import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { LockOutlined, UserOutlined, KeyOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { passwordApi } from '../apiEndpoints/login';
import type { ResetPasswordRequest } from '../apiEndpoints/login';

const { Title, Text } = Typography;

const ResetPasswordForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Prevent scrolling when component mounts
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  const onFinish = async (values: { 
    userName: string; 
    password: string;
    token: string;
  }) => {
    console.log('Form submitted with values:', values);

    setLoading(true);
    try {
      const requestData: ResetPasswordRequest = {
        userName: values.userName,
        password: values.password,
        token: values.token
      };

      console.log('Making API call with data:', requestData);
      
      const response = await passwordApi.resetPassword(requestData);
      
      console.log('API Response:', response);
      
      // Type-safe check for successful response
      if (response && response.resultStatus === "SUCCESSFUL") {
        message.success('Password reset successfully! You can now login with your new password.');
        
        // Redirect to login after success
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        message.error('Password reset failed. Please try again.');
      }
    } catch (error) {
      console.error('API Error:', error);
      message.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to reset password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      height: '100vh',
      background: 'linear-gradient(135deg, #48bb78 0%, #38a169 50%, #2f855a 100%)',
      padding: '20px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Background decorative elements */}
      <div className="background-elements">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-leaf bg-leaf-1">🌿</div>
        <div className="bg-leaf bg-leaf-2">🌱</div>
      </div>

      <div style={{
        width: '100%',
        maxWidth: 480,
        maxHeight: 'calc(100vh - 40px)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Card 
          style={{ 
            width: '100%',
            boxShadow: '0 20px 60px rgba(72, 187, 120, 0.3)',
            borderRadius: '16px',
            border: 'none',
            overflow: 'hidden',
            flex: '0 1 auto'
          }}
          bodyStyle={{ 
            padding: '32px',
            overflow: 'visible'
          }}
        >
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '70px',
              height: '70px',
              backgroundColor: '#f0fff4',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: '3px solid #c6f6d5'
            }}>
              <KeyOutlined style={{ fontSize: '30px', color: '#38a169' }} />
            </div>
            <Title level={2} style={{ color: '#2d3748', marginBottom: '8px', fontSize: '24px' }}>
              Reset Password
            </Title>
            <Text style={{ color: '#718096', fontSize: '14px' }}>
              Enter your credentials to set a new password
            </Text>
          </div>

          {/* Form Section */}
          <Form onFinish={onFinish} layout="vertical" style={{ marginBottom: '0' }}>
            <Form.Item
              name="userName"
              label={<Text strong style={{ color: '#2d3748', fontSize: '14px' }}>Username/Email</Text>}
              rules={[
                { required: true, message: 'Please input your username or email!' },
                { type: 'email', message: 'Please enter a valid email address!' }
              ]}
            >
              <Input 
                prefix={<UserOutlined style={{ color: '#718096' }} />} 
                placeholder="Enter your username or email" 
                size="large"
                style={{
                  height: '44px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  padding: '0 16px',
                  fontSize: '14px'
                }}
              />
            </Form.Item>

            <Form.Item
              name="token"
              label={<Text strong style={{ color: '#2d3748', fontSize: '14px' }}>Reset Token</Text>}
              rules={[
                { required: true, message: 'Please input your reset token!' }
              ]}
            >
              <Input 
                prefix={<KeyOutlined style={{ color: '#718096' }} />} 
                placeholder="Enter reset token from email" 
                size="large"
                style={{
                  height: '44px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  padding: '0 16px',
                  fontSize: '14px'
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<Text strong style={{ color: '#2d3748', fontSize: '14px' }}>New Password</Text>}
              rules={[
                { required: true, message: 'Please input your new password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined style={{ color: '#718096' }} />} 
                placeholder="Enter new password" 
                size="large"
                style={{
                  height: '44px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  padding: '0 16px',
                  fontSize: '14px'
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: '12px' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                block 
                size="large"
                icon={!loading && <CheckCircleOutlined />}
                style={{
                  height: '44px',
                  borderRadius: '8px',
                  backgroundColor: '#38a169',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(56, 161, 105, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2f855a';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(56, 161, 105, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#38a169';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(56, 161, 105, 0.4)';
                }}
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </Form.Item>
          </Form>

          {/* Footer Section */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <Link 
              to="/login" 
              style={{ 
                color: '#38a169',
                textDecoration: 'none',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.3s ease',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2f855a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#38a169';
              }}
            >
              <ArrowLeftOutlined />
              Back to Login
            </Link>
          </div>

          {/* Additional Info */}
          <div style={{ 
            marginTop: '16px',
            padding: '10px',
            backgroundColor: '#f0fff4',
            borderRadius: '6px',
            border: '1px solid #c6f6d5'
          }}>
            <Text style={{ color: '#2f855a', fontSize: '12px' }}>
              🔒 Your password will be securely updated across all Bid-Agri services.
            </Text>
          </div>
        </Card>
      </div>

      {/* Background Decoration */}
      <div style={{
        position: 'fixed',
        top: '5%',
        right: '5%',
        width: '150px',
        height: '150px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        bottom: '5%',
        left: '5%',
        width: '120px',
        height: '120px',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '50%',
        zIndex: 0
      }} />
    </div>
  );
};

export default ResetPasswordForm;