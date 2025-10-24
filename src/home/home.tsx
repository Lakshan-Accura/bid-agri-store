import React from 'react';
import './home.css';
import LayoutView from '../layoutView/layoutView';
import ProtectedRoute from '../protectedRoute';
import { Card, Typography, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { tokenUtils } from '../endpoints/loginEndpoints/login';

const { Title, Text } = Typography;

const Home: React.FC = () => {
  const decodedToken = tokenUtils.getDecodedToken();
  const userName = decodedToken?.name || 'User';

  return (
    <ProtectedRoute>
      <LayoutView>
        <div className="simple-dashboard">
          <Card className="welcome-card" bordered={false}>
            <Space direction="vertical" size="large" align="center">
              <div className="welcome-icon">
                <UserOutlined />
              </div>
              
              <Title level={2} className="welcome-title">
                Welcome, {userName}
              </Title>
              
              <Text className="welcome-message">
                Your agricultural management platform is ready to use.
              </Text>
              
              <div className="system-status">
                <Text type="secondary">
                  All systems are operational
                </Text>
              </div>
            </Space>
          </Card>
        </div>
      </LayoutView>
    </ProtectedRoute>
  );
};

export default Home;