import React, { useState, useEffect } from "react";
import { 
  Avatar, 
  Button, 
  Card, 
  Descriptions, 
  Drawer, 
  Form, 
  Input, 
  message, 
  Modal, 
  Tag,
  Badge,
  Divider,
  Row,
  Col,
  Statistic
} from "antd";
import { 
  SettingOutlined, 
  UserOutlined, 
  LockOutlined, 
  SafetyCertificateOutlined,
  TeamOutlined,
  CalendarOutlined,
  KeyOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import "./Profile.css";
import LayoutView from "../layoutView/layoutView";
import ChangePassword from "../passwordReset/ChangePassword";
import ProtectedRoute from "../protectedRoute";
import { tokenUtils } from "../endpoints/loginEndpoints/login";
import { useAuthStore } from '../store/authStore';

interface UserProfile {
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
  isEnable: boolean;
  tenantId?: number;
  tenantApiKey?: string;
  issuedAt?: number;
  expiration?: number;
  issuer?: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile>({
    name: "",
    email: "",
    roles: [],
    permissions: [],
    isEnable: false,
  });

  const [open, setOpen] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
const { logout } = useAuthStore();

  // Function to format role display
  const formatRoleDisplay = (role: string) => {
    return role
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get user data from decoded JWT token
  useEffect(() => {
    const decodedToken = tokenUtils.getDecodedToken();
    
    if (decodedToken) {
      console.log("Decoded JWT Token in Profile:", decodedToken);
      
      // Format roles for display
      const formattedRoles = decodedToken.roles 
        ? decodedToken.roles.map((role: string) => formatRoleDisplay(role))
        : [];
      
      setUser({
        name: decodedToken.name || "User",
        email: decodedToken.sub || "", // sub is usually the email in JWT
        roles: formattedRoles,
        permissions: decodedToken.permissions?.map((p: any) => p.authority) || [],
        isEnable: decodedToken.isEnable || false,
        tenantId: decodedToken.tenantId,
        tenantApiKey: decodedToken.tenantApiKey,
        issuedAt: decodedToken.iat,
        expiration: decodedToken.exp,
        issuer: decodedToken.iss,
      });
    }
  }, []);

  const onFinish = (values: Partial<UserProfile>) => {
    setUser({ ...user, ...values });
    setOpen(false);
    message.success("Profile updated successfully!");
  };

  // Format timestamp to readable date
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Check if token is expired
  const isTokenExpired = () => {
    if (user.expiration) {
      return Date.now() / 1000 > user.expiration;
    }
    return false;
  };

  // Calculate token expiration time
  const getTokenExpirationTime = () => {
    if (user.expiration) {
      const now = Date.now() / 1000;
      const diff = user.expiration - now;
      if (diff > 0) {
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        return `${hours}h ${minutes}m`;
      }
    }
    return "Expired";
  };

  const decodedToken = tokenUtils.getDecodedToken();
  if (!decodedToken) {
    return (
      <ProtectedRoute>
        <LayoutView>
          <div className="profile-container">
            <Card className="profile-card">
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>Please log in to view your profile.</p>
              </div>
            </Card>
          </div>
        </LayoutView>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <LayoutView>
        <div className="profile-container">
          {/* Stats Row */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
            
            </Col>
          
          </Row>

          {/* Main Profile Card */}
          <Card
            className="profile-card"
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <UserOutlined style={{ color: '#1890ff' }} />
                <span>User Profile</span>
              </div>
            }
         extra={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type="primary"
              icon={<LockOutlined />}
              onClick={() => setChangePasswordModal(true)}
              style={{
                backgroundColor: '#38a169', // green
                borderColor: '#38a169',
                color: '#fff',
              }}
            >
              Change Password
            </Button>
          </div>
        }

          >
            <div className="profile-header">
              <Badge 
                dot 
                color={user.isEnable && !isTokenExpired() ? "#52c41a" : "#ff4d4f"}
                offset={[-5, 65]}
              >
                <Avatar 
                  size={80} 
                  icon={<UserOutlined />} 
                  style={{ 
                    backgroundColor: user.isEnable ? '#87d068' : '#ff7875',
                    border: '3px solid #f0f0f0'
                  }} 
                />
              </Badge>
              <div className="profile-info">
                <h2>{user.name}</h2>
                <p style={{ color: '#666', marginBottom: 8 }}>{user.email}</p>
                <div className="profile-tags">
                  {user.roles.map(role => (
                    <Tag 
                      key={role} 
                      color="blue"
                      icon={<TeamOutlined />}
                      style={{ marginRight: 4, marginBottom: 4 }}
                    >
                      {role}
                    </Tag>
                  ))}
                  <Tag color={user.isEnable ? "success" : "error"}>
                    {user.isEnable ? "Active" : "Inactive"}
                  </Tag>
                 
                </div>
              </div>
            </div>

            <Divider />

            
          </Card>

        

     {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={changePasswordModal}
        onCancel={() => setChangePasswordModal(false)}
        footer={null}
        width={500}
      >
        <ChangePassword 
          userEmail={user.email}
          onSuccess={() => {
            setChangePasswordModal(false);
            
            // ✅ Logout the user
            logout(); // <-- your logout function from auth store or context


          }}
        />
      </Modal>


          {/* Permissions Modal */}
          <Modal
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SafetyCertificateOutlined />
                <span>User Permissions ({user.permissions.length})</span>
              </div>
            }
            open={showPermissions}
            onCancel={() => setShowPermissions(false)}
            footer={[
              <Button key="close" onClick={() => setShowPermissions(false)}>
                Close
              </Button>
            ]}
            width={800}
          >
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '12px' 
              }}>
                {user.permissions.map((permission, index) => (
                  <Card 
                    key={index} 
                    size="small"
                    style={{ 
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px'
                    }}
                    bodyStyle={{ padding: '8px 12px' }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      fontSize: '13px'
                    }}>
                      <SafetyOutlined style={{ color: '#1890ff' }} />
                      <span>{permission}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Modal>
        </div>
      </LayoutView>
    </ProtectedRoute>
  );
};

export default Profile;