import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { passwordApi } from '../endpoints/loginEndpoints/login';
import type { ForgotPasswordRequest } from '../endpoints/loginEndpoints/login';

const { Title, Text } = Typography;

const SendResetEmail: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      const requestData: ForgotPasswordRequest = {
        email: values.email
      };

      // Wait for API call to complete
      await passwordApi.resetPasswordToken(requestData);
      
      // ✅ NAVIGATE AFTER LOADING IS COMPLETED
      navigate('/reset-password', { 
        state: { 
          email: values.email 
        } 
      });
      
    } catch (error) {
      message.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to send reset email. Please try again.'
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
      background: 'linear-gradient(135deg, #48bb78 0%, #38a169 50%, #2f855a 100%)',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 420, 
          boxShadow: '0 20px 60px rgba(72, 187, 120, 0.3)',
          borderRadius: '16px',
          border: 'none',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: '32px' }}
      >
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#f0fff4',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '3px solid #c6f6d5'
          }}>
            <MailOutlined style={{ fontSize: '36px', color: '#38a169' }} />
          </div>
          <Title level={2} style={{ color: '#2d3748', marginBottom: '8px' }}>
            Reset Password
          </Title>
          <Text style={{ color: '#718096', fontSize: '16px' }}>
            Enter your email to receive a password reset link
          </Text>
        </div>

        {/* Form Section */}
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            label={<Text strong style={{ color: '#2d3748' }}>Email Address</Text>}
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: '#718096' }} />} 
              placeholder="Enter your registered email" 
              size="large"
              style={{
                height: '48px',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                padding: '0 16px'
              }}
            />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: '16px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block 
              size="large"
              style={{
                height: '48px',
                borderRadius: '8px',
                backgroundColor: '#38a169',
                border: 'none',
                fontSize: '16px',
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
              {loading ? "Sending Reset Link..." : "Send Reset Link"}
            </Button>
          </Form.Item>
        </Form>

        {/* Footer Section */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '24px',
          paddingTop: '24px',
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
              gap: '8px',
              transition: 'color 0.3s ease'
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
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#f0fff4',
          borderRadius: '8px',
          border: '1px solid #c6f6d5'
        }}>
          <Text style={{ color: '#2f855a', fontSize: '14px' }}>
            💡 You will receive an email with instructions to reset your password.
          </Text>
        </div>
      </Card>

      {/* Background Decoration */}
      <div style={{
        position: 'fixed',
        top: '10%',
        right: '10%',
        width: '200px',
        height: '200px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        bottom: '10%',
        left: '10%',
        width: '150px',
        height: '150px',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '50%',
        zIndex: 0
      }} />
    </div>
  );
};

export default SendResetEmail;