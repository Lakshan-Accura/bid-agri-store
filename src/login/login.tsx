import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Typography, message, Alert, Card } from "antd";
import { LockOutlined, MailOutlined, CloseCircleOutlined, UserOutlined } from "@ant-design/icons";
import "./login.css";
import { useAuthStore } from "../store/authStore";
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export default function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Use Zustand store
  const { isAuthenticated, checkAuth, login } = useAuthStore();

  useEffect(() => {
    document.body.classList.add("login-page");
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Check authentication on component mount
    checkAuth();
    
    // Redirect if already authenticated
    if (isAuthenticated) {
      message.info("You are already logged in!");
      window.location.href = "/dashboard";
    }

    return () => {
      document.body.classList.remove("login-page");
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isAuthenticated, checkAuth]);

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    setErrorMessage(''); // Clear previous errors
    
    try {
      // Call Zustand login action
      await login(values.email, values.password);
      
      message.success("Login successful! Redirecting to dashboard...");
      
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);

    } catch (error) {
      console.error("Login failed:", error);
      
      let errorMsg = "Login failed. Please check your credentials and try again.";
      
      if (error instanceof Error) {
        errorMsg = error.message;
        
        // Handle specific error cases
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          errorMsg = "Invalid email or password. Please check your credentials.";
        } else if (error.message.includes('404')) {
          errorMsg = "User not found. Please check your email address.";
        } else if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
          errorMsg = "Network error. Please check your internet connection and try again.";
        } else if (error.message.includes('500')) {
          errorMsg = "Server error. Please try again later.";
        } else if (error.message.includes('SUPER_ADMIN')) {
          errorMsg = "Access denied. Only SUPER_ADMIN users are allowed to login.";
        }
      }
      
      setErrorMessage(errorMsg);
      
      // Also show as message for visibility
      message.error(errorMsg);
      
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Form validation failed:', errorInfo);
    setErrorMessage('Please fix the form errors before submitting.');
  };

  const clearError = () => {
    setErrorMessage('');
  };

  return (
    <section className="login-section">
       
        <div 
        className="background-image"
        style={{
          backgroundImage: "url('src/assets/background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1
        }}
      ></div>


      <div className="login-container">
        <Card className="login-card">
          {/* Header Section */}
          <div className="login-header">
            <div className="logo-container">
              <img
                src="src/assets/Dark Type.png"
                alt="Bid-Agri Logo"
                className="login-logo"
              />
            </div>
            <Title level={2} className="login-title">
              Welcome to Bid-Agri
            </Title>
            <Text className="login-subtitle">
              Cultivating Success Through Digital Agriculture
            </Text>
            <Text type="warning" className="role-warning">
              * Only SUPER_ADMIN access allowed
            </Text>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <Alert
              message="Login Failed"
              description={errorMessage}
              type="error"
              showIcon
              icon={<CloseCircleOutlined />}
              closable
              onClose={clearError}
              className="login-alert"
            />
          )}

          {/* Login Form */}
          <Form
            form={form}
            name="normal_login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            requiredMark="optional"
            disabled={loading}
            className="login-form"
          >
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { 
                  type: "email", 
                  required: true, 
                  message: "Please input your valid Email!" 
                },
              ]}
              validateStatus={errorMessage ? "error" : ""}
            >
              <Input 
                prefix={<MailOutlined className="input-icon" />} 
                placeholder="Enter your email" 
                size="large"
                className="login-input"
                onChange={clearError}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { 
                  required: true, 
                  message: "Please input your Password!" 
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters!"
                }
              ]}
              validateStatus={errorMessage ? "error" : ""}
            >
              <Input.Password 
                prefix={<LockOutlined className="input-icon" />} 
                placeholder="Enter your password" 
                size="large"
                className="login-input"
                onChange={clearError}
              />
            </Form.Item>

            <Form.Item className="form-options">
              <div className="options-container">
                <Checkbox name="remember" className="remember-checkbox">
                  Remember me
                </Checkbox>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
            <Button 
                block 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                size="large"
                className="login-button"
                icon={<UserOutlined />}
                style={{
                  backgroundColor: '#52c41a',
                  borderColor: '#52c41a',
                }}
              >
                {loading ? "Signing in..." : "Sign In to Dashboard"}
              </Button>
            </Form.Item>
          </Form>

          {/* Footer */}
          <div className="login-footer">
            <Text className="footer-text">
              Ready to grow your agricultural business?
            </Text>
            <Text type="warning" style={{ fontSize: '12px', display: 'block', marginTop: '8px' }}>
              * Access restricted to SUPER_ADMIN users only
            </Text>
          </div>
        </Card>
      </div>
    </section>
  );
}