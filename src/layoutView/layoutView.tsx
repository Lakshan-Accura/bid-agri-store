import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Layout, Menu, theme, Avatar, message, Typography, Drawer } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  DashboardOutlined, 
  ShoppingOutlined, 
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { Button } from 'antd';
import type { MenuProps } from "antd";
import './layoutView.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { tokenUtils } from '../endpoints/loginEndpoints/login';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface LayoutViewProps {
  children?: ReactNode;
}

const LayoutView: React.FC<LayoutViewProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Check if mobile view on component mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      // Auto-collapse sidebar on mobile
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Get user name from JWT token
  const decodedToken = tokenUtils.getDecodedToken();
  const userName = decodedToken?.name || user?.firstName || user?.email || 'User';

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "products":
        navigate("/products");
        break;
      case "users":
        navigate("/users");
        break;
      case "tenants":
        navigate("/tenants");
        break;
      case "profile":
        navigate("/profile");
        break;
      default:
        break;
    }
    
    // Close mobile drawer after navigation
    if (isMobile) {
      setMobileDrawerVisible(false);
    }
  };

  const handleLogout = () => {
    logout();
    message.success('Logged out successfully');
    navigate('/login');
  };

  // Map routes to menu keys
  const getCurrentKey = () => {
    const path = location.pathname;
    if (path.includes('/dashboard') || path === '/') return 'dashboard';
    if (path.includes('/products')) return 'products';
    if (path.includes('/users')) return 'users';
    if (path.includes('/tenants')) return 'tenants';
    if (path.includes('/profile')) return 'profile';
    return 'dashboard';
  };

  const currentKey = getCurrentKey();

  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    // {
    //   key: 'products',
    //   icon: <ShoppingOutlined />,
    //   label: 'Products',
    // },
    // {
    //   key: 'users',
    //   icon: <UserOutlined />,
    //   label: 'Users',
    // },
    {
      key: 'tenants',
      icon: <TeamOutlined />,
      label: 'Agri Stores',
    },
  ];

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileDrawerVisible(!mobileDrawerVisible);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const closeMobileDrawer = () => {
    setMobileDrawerVisible(false);
  };

  // Desktop Sidebar Component
  const DesktopSidebar = () => (
    <Sider 
      trigger={null} 
      collapsible 
      collapsed={collapsed}
      style={{
        background: 'linear-gradient(180deg, #006d2c, #00441b)',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
      }}
      className="custom-sider"
      breakpoint="lg"
      collapsedWidth={isMobile ? 0 : 80}
      onBreakpoint={(broken) => {
        setIsMobile(broken);
        if (broken) {
          setCollapsed(true);
        }
      }}
    >
      {/* Logo Section */}
      <div className="logo-section" style={{ 
        padding: collapsed ? '16px 8px' : '16px', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
      }}>
        {collapsed ? (
          <img
            src="src/assets/Dark Type.png"
            alt="Logo"
            style={{
              backgroundColor: "white",
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              padding: "4px",
              objectFit: "contain",
            }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <img
              src="src/assets/Dark Type.png"
              alt="Logo"
              style={{
                backgroundColor: "white",
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                padding: "4px",
                objectFit: "contain",
              }}
            />
            <Text strong style={{ color: 'white', fontSize: '16px' }}>
              Bid-Agri
            </Text>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[currentKey]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          background: 'transparent',
          border: 'none',
          marginTop: '16px'
        }}
        className="sidebar-menu"
      />
    </Sider>
  );

  // Mobile Drawer Component
  const MobileDrawer = () => (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="src/assets/Dark Type.png"
            alt="Logo"
            style={{
              backgroundColor: "white",
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              padding: "3px",
              objectFit: "contain",
            }}
          />
          <Text strong style={{ color: 'white', fontSize: '16px' }}>
            Bid-Agri
          </Text>
        </div>
      }
      placement="left"
      onClose={closeMobileDrawer}
      open={mobileDrawerVisible}
      bodyStyle={{ 
        padding: 0,
        background: 'linear-gradient(180deg, #006d2c, #00441b)',
      }}
      headerStyle={{
        background: 'linear-gradient(180deg, #006d2c, #00441b)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
      closeIcon={<CloseOutlined style={{ color: 'white' }} />}
      width={280}
    >
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[currentKey]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          background: 'transparent',
          border: 'none',
          marginTop: '16px'
        }}
        className="sidebar-menu"
      />
    </Drawer>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Desktop Sidebar - Hidden on mobile when collapsed */}
      {!isMobile && <DesktopSidebar />}
      
      {/* Mobile Drawer */}
      {isMobile && <MobileDrawer />}

      {/* Main Layout */}
      <Layout>
        {/* Top Header */}
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 999
        }}>
          {/* Left: Collapse button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              type="text"
              icon={isMobile ? <MenuUnfoldOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
              onClick={toggleSidebar}
              style={{
                fontSize: '18px',
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="sidebar-toggle-btn"
            />
            
            {/* Show logo text next to toggle button on mobile when sidebar is collapsed */}
            {isMobile && (
              <Text strong style={{ fontSize: '16px', color: '#262626' }}>
                Bid-Agri
              </Text>
            )}
          </div>

          {/* Right: User Info + Logout */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* User Info - Hidden on very small mobile screens */}
            <div 
              className={`user-info-container ${isMobile ? 'mobile-hidden' : ''}`} 
              onClick={() => navigate('/profile')}
            >
              <div className="user-info-text">
                <div className="welcome-row">
                  <span className="welcome-text">Welcome,</span>
                  <span className="user-name">{userName}</span>
                </div>
                <div className="user-email">
                  {user?.email}
                </div>
              </div>
            </div>
            
            {/* Avatar - Always visible */}
            <Avatar
              style={{ backgroundColor: '#87d068', cursor: "pointer" }}
              icon={<UserOutlined />}
              onClick={() => navigate('/profile')}
              size={isMobile ? 'default' : 'large'}
            />
            
            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              type="primary"
              icon={<LogoutOutlined />}
              danger
              size={isMobile ? 'small' : 'middle'}
              className={isMobile ? 'logout-btn-mobile' : ''}
            >
              {isMobile ? '' : 'Logout'}
            </Button>
          </div>
        </Header>

        {/* Main Content */}
        <Content style={{ 
          margin: isMobile ? '16px' : '24px', 
          padding: isMobile ? '16px' : '24px',
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          minHeight: 280,
          overflow: 'auto'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutView;