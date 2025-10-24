// components/TenantForm.tsx
import React from 'react';
import { Form, Input, Switch, Typography } from 'antd';
import type { FormInstance } from 'antd';

const { Text } = Typography;

export interface Tenant {
  id?: number;
  tenantCode: string;
  tenantName: string;
  enabled: boolean;
}

export interface TenantFormValues {
  tenantCode: string;
  tenantName: string;
  enabled: boolean;
}

type FormMode = 'add' | 'edit' | 'view';

interface TenantFormProps {
  form: FormInstance;
  initialValues?: Partial<TenantFormValues>;
  mode?: FormMode;
}

const TenantForm: React.FC<TenantFormProps> = ({ 
  form, 
  initialValues, 
  mode = 'add' 
}) => {
  const isViewMode = mode === 'view';

  // Get display value for view mode
  const getDisplayValue = (fieldName: keyof TenantFormValues) => {
    const value = initialValues?.[fieldName];
    
    if (value === undefined || value === null) return '-';
    
    // Handle boolean values specifically
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    return value.toString();
  };

  // Get display style for boolean values
  const getBooleanDisplayStyle = (value: boolean) => {
    return {
      padding: '4px 8px',
      borderRadius: '4px',
      fontWeight: 'bold' as const,
      color: value ? '#52c41a' : '#ff4d4f',
      background: value ? '#f6ffed' : '#fff2f0',
      border: `1px solid ${value ? '#b7eb8f' : '#ffccc7'}`
    };
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="tenantForm"
      requiredMark="optional"
      initialValues={{
        enabled: true,
        ...initialValues
      }}
      disabled={isViewMode}
    >
      {/* Tenant Code */}
      {isViewMode ? (
        <div style={{ marginBottom: 16 }}>
          <Text strong>Agri Store Code:</Text>
          <div style={{ 
            padding: '8px', 
            background: '#f5f5f5', 
            borderRadius: '4px',
            marginTop: '4px',
            fontFamily: 'monospace'
          }}>
            {getDisplayValue('tenantCode')}
          </div>
        </div>
      ) : (
        <Form.Item
          label="Agri Store Code"
          name="tenantCode"
          rules={[
            { required: true, message: 'Please enter Agri Store code' },
            { min: 2, message: 'Agri Store code must be at least 2 characters' },
            { max: 50, message: 'Agri Store code cannot exceed 50 characters' },
            { 
              pattern: /^[A-Za-z0-9_-]+$/,
              message: 'Agri Store code can only contain letters, numbers, hyphens, and underscores'
            }
          ]}
        >
          <Input 
            placeholder="Enter Agri Store code (e.g., TEN001)" 
            style={{ fontFamily: 'monospace' }}
          />
        </Form.Item>
      )}

      {/* Tenant Name */}
      {isViewMode ? (
        <div style={{ marginBottom: 16 }}>
          <Text strong>Agri Store Name:</Text>
          <div style={{ 
            padding: '8px', 
            background: '#f5f5f5', 
            borderRadius: '4px',
            marginTop: '4px'
          }}>
            {getDisplayValue('tenantName')}
          </div>
        </div>
      ) : (
        <Form.Item
          label="Agri Store Name"
          name="tenantName"
          rules={[
            { required: true, message: 'Please enter Agri Store name' },
            { min: 2, message: 'Agri Store name must be at least 2 characters' },
            { max: 100, message: 'Agri Store name cannot exceed 100 characters' }
          ]}
        >
          <Input placeholder="Enter Agri Store name" />
        </Form.Item>
      )}

      {/* Enabled Status */}
      {isViewMode ? (
        <div style={{ marginBottom: 16 }}>
          <Text strong>Enabled:</Text>
          <div style={{ marginTop: '4px' }}>
            <span style={getBooleanDisplayStyle(initialValues?.enabled === true)}>
              {getDisplayValue('enabled')}
            </span>
          </div>
        </div>
      ) : (
        <Form.Item
          label="Enabled"
          name="enabled"
          valuePropName="checked"
          rules={[{ required: false }]}
        >
          <Switch 
            checkedChildren="Active" 
            unCheckedChildren="Inactive"
          />
        </Form.Item>
      )}
      
    </Form>
  );
};

export default TenantForm;