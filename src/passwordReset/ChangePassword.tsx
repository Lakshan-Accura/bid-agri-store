import React, { useState } from 'react';
import { Form, Input, Button, message, Alert } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { passwordApi } from '../endpoints/loginEndpoints/login';
import type { ChangePasswordRequest } from '../endpoints/loginEndpoints/login';

interface ChangePasswordProps {
  userEmail: string;
  onSuccess: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ userEmail, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [form] = Form.useForm();

  const onFinish = async (values: {
    email: string;
    oldPassword: string;
    newPassword: string;
  }) => {
    if (values.oldPassword === values.newPassword) {
      setErrorMessage('New password must be different from old password!');
      return;
    }

    setLoading(true);
    setErrorMessage(''); // Clear previous errors

    try {
      const requestData: ChangePasswordRequest = {
        email: values.email,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      };

      console.log('🔄 Sending change password request:', JSON.stringify(requestData, null, 2));

      const response = await passwordApi.changePassword(requestData);
      
      console.log('✅ API Response:', response);
      
      if (response.resultStatus === "SUCCESSFUL" || response.success) {
        message.success('Password changed successfully!');
        form.resetFields();
        setErrorMessage(''); // Clear any errors
        onSuccess();
      } else {
        // Handle specific error messages from API
        const errorMessage = response.message || 'Failed to change password. Please try again.';
        
        // Check if the error indicates wrong current password
        if (errorMessage.toLowerCase().includes('current password') || 
            errorMessage.toLowerCase().includes('old password') ||
            errorMessage.toLowerCase().includes('incorrect password') ||
            errorMessage.toLowerCase().includes('invalid password')) {
          setErrorMessage('Current password is incorrect. Please try again.');
        } else {
          setErrorMessage(errorMessage);
        }
      }
    } catch (error: any) {
      console.error('❌ Change password error details:', error);
      
      // Enhanced error handling for different error types
      let userFriendlyError = 'Failed to change password. Please try again.';
      
      // Check for HTTP status codes
      if (error.status === 401 || error.code === 401 || error.response?.status === 401) {
        userFriendlyError = 'Current password is incorrect. Please check your current password and try again.';
      }
      // Check for specific error messages in the error object
      else if (error.message) {
        const errorMsg = error.message.toLowerCase();
        if (errorMsg.includes('current password') || 
            errorMsg.includes('old password') ||
            errorMsg.includes('incorrect password') ||
            errorMsg.includes('invalid password') ||
            errorMsg.includes('401')) {
          userFriendlyError = 'Current password is incorrect. Please check your current password and try again.';
        } else {
          userFriendlyError = error.message;
        }
      }
      // Check for axios-like error response
      else if (error.response?.data?.message) {
        const errorMsg = error.response.data.message.toLowerCase();
        if (errorMsg.includes('current password') || 
            errorMsg.includes('old password') ||
            errorMsg.includes('incorrect password') ||
            errorMsg.includes('invalid password')) {
          userFriendlyError = 'Current password is incorrect. Please check your current password and try again.';
        } else {
          userFriendlyError = error.response.data.message;
        }
      }
      // Check for fetch-like error response
      else if (error.data?.message) {
        const errorMsg = error.data.message.toLowerCase();
        if (errorMsg.includes('current password') || 
            errorMsg.includes('old password') ||
            errorMsg.includes('incorrect password') ||
            errorMsg.includes('invalid password')) {
          userFriendlyError = 'Current password is incorrect. Please check your current password and try again.';
        } else {
          userFriendlyError = error.data.message;
        }
      }

      setErrorMessage(userFriendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '10px 0' }}>
      {/* Error Alert - shows at the top of the popup */}
      {errorMessage && (
        <Alert
          message="Change Password Error"
          description={errorMessage}
          type="error"
          showIcon
          closable
          onClose={() => setErrorMessage('')}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        requiredMark="optional"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email address!' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="Enter your email" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="oldPassword"
          label="Current Password"
          rules={[
            { required: true, message: 'Please input your current password!' },
            { min: 6, message: 'Password must be at least 6 characters!' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Enter your current password" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: 'Please input your new password!' },
            { min: 6, message: 'Password must be at least 6 characters!' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Enter new password" 
            size="large"
          />
        </Form.Item>

          <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={["newPassword"]}
        rules={[
          { required: true, message: "Please confirm your password!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The two passwords do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Confirm your password"
          size="large"
        />
      </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            block 
            size="large"
            className="change-password-button"
            style={{
              backgroundColor: '#338609ff',
              border: 'none',
              height: '44px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            {loading ? "Changing Password..." : "Change Password"}
          </Button>
        </Form.Item>
      </Form>

      <Alert
        message="Password Requirements"
        description="Password must be at least 6 characters long. New password must be different from current password."
        type="info"
        showIcon
        style={{ 
          marginTop: '16px',
          border: '1px solid #52c41a20',
          background: '#f6ffed'
        }}
      />
    </div>
  );
};

export default ChangePassword;