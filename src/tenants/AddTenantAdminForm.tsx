import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  message,
  Space,
  Divider,
  Select,
  Alert,
  Result,
  Breadcrumb
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  ShopOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { tenantApi } from '../endpoints/tenantsEndpoints/tenants';
import { brandColors } from '../config/color';

const { Option } = Select;

// ✅ Added props for modal support
interface AddTenantAdminFormProps {
  onClose?: () => void;
  isModal?: boolean;
}

const AddTenantAdminForm: React.FC<AddTenantAdminFormProps> = ({ onClose, isModal = false }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [tenants, setTenants] = useState<any[]>([]);
  const [verificationSent, setVerificationSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // ✅ Load tenants
  useEffect(() => {
    const loadTenants = async () => {
      try {
        const response = await tenantApi.getAllTenants();
        if (response.payloadDto) {
          setTenants(response.payloadDto);
        }
      } catch (error) {
        console.error('Failed to load tenants:', error);
        message.error('Failed to load tenants list');
      }
    };
    loadTenants();
  }, []);

  const handleResendVerification = async () => {
    if (!userEmail) return;
    setResendLoading(true);
    try {
      const response = await tenantApi.resendVerificationToken(userEmail);
      if (response.resultStatus === 'SUCCESSFUL') {
        message.success('Verification email sent successfully!');
      } else {
        message.error(response.message || 'Failed to send verification email');
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      message.error('Failed to send verification email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  // ✅ Back button behavior (modal-safe)
  const handleBackToList = () => {
    if (isModal && onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handleCreateAnother = () => {
    setVerificationSent(false);
    setUserEmail('');
    form.resetFields();
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const formData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        tempPassword: values.tempPassword,
        matchingPassword: values.matchingPassword,
        tenantDTO: {
          id: values.tenantId
        },
        roleDTOs: [
          {
            id: 2
          }
        ]
      };

      const response = await tenantApi.createTenantAdmin(formData);
      if (response.resultStatus === 'SUCCESSFUL') {
        setUserEmail(values.email);
        setVerificationSent(true);
        message.success('Agri Store Admin created successfully! Verification email sent.');
      } else {
        message.error(response.message || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      message.error('Failed to create admin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Breadcrumb item component
  const BreadcrumbItem = ({
    title,
    onClick,
    icon
  }: {
    title: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }) => (
    <span
      onClick={onClick}
      style={{
        cursor: 'pointer',
        color: '#1890ff',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#40a9ff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#1890ff';
      }}
    >
      {icon}
      {title}
    </span>
  );

  // ✅ Success view (still works in modal)
  if (verificationSent) {
    return (
      <div style={{ padding: '24px' }}>
        <Card style={{ maxWidth: 600, margin: '0 auto' }}>
         

          <Result
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="Agri Store Admin Created Successfully!"
            subTitle={`A verification email has been sent to ${userEmail}`}
          extra={
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                {/* First row: two buttons side by side */}
                <Space>
                  <Button
                    key="resend"
                    type="primary"
                    icon={<ReloadOutlined />}
                    loading={resendLoading}
                    onClick={handleResendVerification}
                    style={{
                      backgroundColor: brandColors.primary,
                      borderColor: brandColors.primary,
                    }}
                  >
                    Resend Verification Email
                  </Button>

                  <Button key="close" onClick={handleBackToList}>
                    {isModal ? 'Close' : 'Back to Management'}
                  </Button>
                </Space>

                {/* Second row: single button below */}
                <Button key="new" onClick={handleCreateAnother}>
                  Create Another Admin
                </Button>
              </div>
            }
          />

          <Alert
            message="Email Verification Required"
            description={
              <div>
                <p>The new admin must verify their email address before they can login.</p>
                <p>If they didn't receive the email:</p>
                <ul>
                  <li>Check spam or junk folder</li>
                  <li>Verify the email address is correct: <strong>{userEmail}</strong></li>
                  <li>Click "Resend Verification Email" above</li>
                </ul>
              </div>
            }
            type="info"
            showIcon
            style={{ marginTop: 24 }}
          />
        </Card>
      </div>
    );
  }

  // ✅ Registration form view
  return (
    <div style={{ padding: isModal ? '0' : '24px' }}>
      <Card
        title={
          <Space>
            <UserOutlined />
            <span>Add New Agri Store Admin</span>
          </Space>
        }
        extra={
          !isModal && (
            <Button icon={<ArrowLeftOutlined />} onClick={handleBackToList}>
              Back to Management
            </Button>
          )
        }
        style={{ maxWidth: 600, margin: '0 auto' }}
      >
        
        <Alert
          message="Email Verification Required"
          description="After registration, the user will receive a verification email. They must verify their email before they can login."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="First name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Last name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email address" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Temporary Password"
                name="tempPassword"
                rules={[
                  { required: true, message: 'Please enter password' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="tempPassword" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Confirm Password"
                name="matchingPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('tempPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    }
                  })
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Confirm password" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Agri Store"
            name="tenantId"
            rules={[{ required: true, message: 'Please select an agri store' }]}
          >
            <Select placeholder="Select agri store" suffixIcon={<ShopOutlined />} loading={tenants.length === 0}>
              {tenants.map((tenant) => (
                <Option key={tenant.id} value={tenant.id}>
                  {tenant.tenantName} ({tenant.tenantCode})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Divider />

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleBackToList}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                Create Agri Store Admin
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddTenantAdminForm;
