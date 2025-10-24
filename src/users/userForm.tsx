// components/ProductForm.tsx
import React from 'react';
import { Form, Input, InputNumber, Select, Tag, Typography } from 'antd';
import type { FormInstance } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

export interface User {
  id: number;
  name: string;
  age: number;
  address: string;
  tags: string[];
  email: string;
  phone: string;
}

export interface UserFormValues {
  name: string;
  age: number;
  address: string;
  tags: string[];
  email: string;
  phone: string;
}

type FormMode = 'add' | 'edit' | 'view';

interface UserFormProps {
  form: FormInstance;
  initialValues?: Partial<UserFormValues>;
  mode?: FormMode;
}

const UserForm: React.FC<UserFormProps> = ({ 
  form, 
  initialValues, 
  mode = 'add' 
}) => {
  const isViewMode = mode === 'view';

  // Get display value for view mode
  const getDisplayValue = (fieldName: keyof UserFormValues) => {
    const value = initialValues?.[fieldName];
    if (value === undefined || value === null) return '-';
    
    return value.toString();
  };

  return (
  <Form
  form={form}
  layout="vertical"
  name="productForm"
  requiredMark="optional"
  initialValues={initialValues}
  disabled={isViewMode}
>
  {/* Name */}
  {isViewMode ? (
    <div style={{ marginBottom: 16 }}>
      <Text strong>Name:</Text>
      <div style={{ 
        padding: '8px', 
        background: '#f5f5f5', 
        borderRadius: '4px',
        marginTop: '4px'
      }}>
        {getDisplayValue('name')}
      </div>
    </div>
  ) : (
    <Form.Item
      label="Name"
      name="name"
      rules={[
        { required: true, message: 'Please enter name' },
        { min: 2, message: 'Name must be at least 2 characters' }
      ]}
    >
      <Input placeholder="Enter name" />
    </Form.Item>
  )}

  {/* Age */}
  {isViewMode ? (
    <div style={{ marginBottom: 16 }}>
      <Text strong>Age:</Text>
      <div style={{ 
        padding: '8px', 
        background: '#f5f5f5', 
        borderRadius: '4px',
        marginTop: '4px'
      }}>
        {getDisplayValue('age')}
      </div>
    </div>
  ) : (
    <Form.Item
      label="Age"
      name="age"
      rules={[
        { required: true, message: 'Please enter age' },
        { type: 'number', min: 0, max: 150, message: 'Age must be between 0 and 150' }
      ]}
    >
      <InputNumber
        min={0}
        max={150}
        style={{ width: '100%' }}
        placeholder="Enter age"
      />
    </Form.Item>
  )}

  {/* Address */}
  {isViewMode ? (
    <div style={{ marginBottom: 16 }}>
      <Text strong>Address:</Text>
      <div style={{ 
        padding: '8px', 
        background: '#f5f5f5', 
        borderRadius: '4px',
        marginTop: '4px',
        whiteSpace: 'pre-wrap'
      }}>
        {getDisplayValue('address')}
      </div>
    </div>
  ) : (
    <Form.Item
      label="Address"
      name="address"
      rules={[{ required: true, message: 'Please enter address' }]}
    >
      <TextArea 
        rows={3} 
        placeholder="Enter address"
        showCount 
        maxLength={200}
      />
    </Form.Item>
  )}

  {/* Email */}
  {isViewMode ? (
    <div style={{ marginBottom: 16 }}>
      <Text strong>Email:</Text>
      <div style={{ 
        padding: '8px', 
        background: '#f5f5f5', 
        borderRadius: '4px',
        marginTop: '4px'
      }}>
        {getDisplayValue('email')}
      </div>
    </div>
  ) : (
    <Form.Item
      label="Email"
      name="email"
      rules={[
        { required: true, message: 'Please enter email' },
        { type: 'email', message: 'Please enter a valid email' }
      ]}
    >
      <Input placeholder="Enter email address" />
    </Form.Item>
  )}

  {/* Phone */}
  {isViewMode ? (
    <div style={{ marginBottom: 16 }}>
      <Text strong>Phone:</Text>
      <div style={{ 
        padding: '8px', 
        background: '#f5f5f5', 
        borderRadius: '4px',
        marginTop: '4px'
      }}>
        {getDisplayValue('phone')}
      </div>
    </div>
  ) : (
    <Form.Item
      label="Phone"
      name="phone"
      rules={[
        { required: true, message: 'Please enter phone number' },
        { pattern: /^[+]?[\d\s\-()]+$/, message: 'Please enter a valid phone number' }
      ]}
    >
      <Input placeholder="Enter phone number" />
    </Form.Item>
  )}

  {/* Tags */}
 {/* Tags */}
    {isViewMode ? (
      <div style={{ marginBottom: 16 }}>
        <Text strong>Tags:</Text>
        <div style={{ marginTop: '4px' }}>
          {(() => {
            const tagsValue = getDisplayValue('tags');
            
            // Handle different tag formats
            if (Array.isArray(tagsValue)) {
              return tagsValue.map((tag, index) => (
                <Tag 
                  key={index}
                  color={['blue', 'green', 'red', 'orange', 'purple', 'cyan'][index % 6]}
                  style={{ marginBottom: '4px', marginRight: '4px' }}
                >
                  {tag}
                </Tag>
              ));
            } else if (typeof tagsValue === 'string' && tagsValue.trim()) {
              // If tags are stored as comma-separated string
              const tagsArray = tagsValue.split(',').map(tag => tag.trim()).filter(tag => tag);
              return tagsArray.map((tag, index) => (
                <Tag 
                  key={index}
                  color={['blue', 'green', 'red', 'orange', 'purple', 'cyan'][index % 6]}
                  style={{ marginBottom: '4px', marginRight: '4px' }}
                >
                  {tag}
                </Tag>
              ));
            } else {
              return (
                <div style={{ 
                  padding: '8px', 
                  background: '#f5f5f5', 
                  borderRadius: '4px'
                }}>
                  No tags
                </div>
              );
            }
          })()}
        </div>
      </div>
    ) : (
      <Form.Item
        label="Tags"
        name="tags"
        rules={[{ required: false }]}
      >
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Enter tags"
          tokenSeparators={[',']}
        />
      </Form.Item>
    )}
</Form>
  );
};

export default UserForm;