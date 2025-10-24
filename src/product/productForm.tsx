// components/ProductForm.tsx
import React from 'react';
import { Form, Input, InputNumber, Select, Typography } from 'antd';
import type { FormInstance } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
}

export interface ProductFormValues {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

type FormMode = 'add' | 'edit' | 'view';

interface ProductFormProps {
  form: FormInstance;
  initialValues?: Partial<ProductFormValues>;
  mode?: FormMode;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  form, 
  initialValues, 
  mode = 'add' 
}) => {
  const isViewMode = mode === 'view';

  // Get display value for view mode
  const getDisplayValue = (fieldName: keyof ProductFormValues) => {
    const value = initialValues?.[fieldName];
    if (value === undefined || value === null) return '-';
    
    if (fieldName === 'price') {
      return `$${Number(value).toFixed(2)}`;
    }
    
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
      {/* Product Name */}
      {isViewMode ? (
        <div style={{ marginBottom: 16 }}>
          <Text strong>Product Name:</Text>
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
          label="Product Name"
          name="name"
          rules={[
            { required: true, message: 'Please enter product name' },
            { min: 2, message: 'Product name must be at least 2 characters' }
          ]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>
      )}

      {/* Category */}
      {isViewMode ? (
        <div style={{ marginBottom: 16 }}>
          <Text strong>Category:</Text>
          <div style={{ 
            padding: '8px', 
            background: '#f5f5f5', 
            borderRadius: '4px',
            marginTop: '4px'
          }}>
            {getDisplayValue('category')}
          </div>
        </div>
      ) : (
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: 'Please select category' }]}
        >
          <Select placeholder="Select category">
            <Option value="Electronics">Electronics</Option>
            <Option value="Furniture">Furniture</Option>
            <Option value="Kitchen">Kitchen</Option>
            <Option value="Clothing">Clothing</Option>
            <Option value="Books">Books</Option>
            <Option value="Sports">Sports</Option>
          </Select>
        </Form.Item>
      )}

      {/* Price */}
      {isViewMode ? (
        <div style={{ marginBottom: 16 }}>
          <Text strong>Price:</Text>
          <div style={{ 
            padding: '8px', 
            background: '#f5f5f5', 
            borderRadius: '4px',
            marginTop: '4px'
          }}>
            {getDisplayValue('price')}
          </div>
        </div>
      ) : (
        <Form.Item
          label="Price"
          name="price"
          rules={[
            { required: true, message: 'Please enter price' },
            { type: 'number', min: 0.01, message: 'Price must be greater than 0' }
          ]}
        >
          <InputNumber
            min={0}
            step={0.01}
            style={{ width: '100%' }}
            placeholder="Enter price"
            formatter={value => `$ ${value}`}
            parser={value => value?.replace(/\$\s?|(,*)/g, '') as any}
          />
        </Form.Item>
      )}

      {/* Stock */}
      {isViewMode ? (
        <div style={{ marginBottom: 16 }}>
          <Text strong>Stock Quantity:</Text>
          <div style={{ 
            padding: '8px', 
            background: '#f5f5f5', 
            borderRadius: '4px',
            marginTop: '4px'
          }}>
            {getDisplayValue('stock')}
          </div>
        </div>
      ) : (
        <Form.Item
          label="Stock Quantity"
          name="stock"
          rules={[
            { required: true, message: 'Please enter stock quantity' },
            { type: 'number', min: 0, message: 'Stock cannot be negative' }
          ]}
        >
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            placeholder="Enter stock quantity"
          />
        </Form.Item>
      )}

      {/* Description */}
      {isViewMode ? (
        <div style={{ marginBottom: 16 }}>
          <Text strong>Description:</Text>
          <div style={{ 
            padding: '8px', 
            background: '#f5f5f5', 
            borderRadius: '4px',
            marginTop: '4px',
            whiteSpace: 'pre-wrap'
          }}>
            {getDisplayValue('description')}
          </div>
        </div>
      ) : (
        <Form.Item
          label="Description"
          name="description"
          rules={[{ max: 500, message: 'Description cannot exceed 500 characters' }]}
        >
          <TextArea 
            rows={4} 
            placeholder="Enter product description (optional)"
            showCount 
            maxLength={500}
          />
        </Form.Item>
      )}
    </Form>
  );
};

export default ProductForm;