// components/ProductList.tsx
import React, { useState } from 'react';
import { Table, Button, Space, Modal, message, Card, Form, Tag } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import ProductForm, { type Product, type ProductFormValues } from './productForm.tsx';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Laptop',
      category: 'Electronics',
      price: 999.99,
      stock: 15,
      description: 'High-performance laptop for professionals'
    },
    {
      id: 2,
      name: 'Smartphone',
      category: 'Electronics',
      price: 699.99,
      stock: 30,
      description: 'Latest smartphone with advanced features'
    },
    {
      id: 3,
      name: 'Desk Chair',
      category: 'Furniture',
      price: 199.99,
      stock: 10,
      description: 'Ergonomic office chair for comfort'
    },
    {
      id: 4,
      name: 'Coffee Mug',
      category: 'Kitchen',
      price: 12.99,
      stock: 50,
      description: 'Ceramic coffee mug with elegant design'
    },
       {
      id: 5,
      name: 'Coffee Mug 2',
      category: 'Kitchen 2',
      price: 12.99,
      stock: 50,
      description: 'Ceramic coffee mug with elegant design 2'
    },
       {
      id: 6,
      name: 'Coffee Mug 3',
      category: 'Kitchen 3',
      price: 12.99,
      stock: 50,
      description: 'Ceramic coffee mug with elegant design 3'
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [form] = Form.useForm();

  // Open Modal with specific mode
  const openModal = (mode: 'add' | 'edit' | 'view', product?: Product): void => {
    setModalMode(mode);
    setSelectedProduct(product || null);
    
    if (mode === 'add') {
      form.resetFields();
    } else if (product) {
      form.setFieldsValue({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description || ''
      });
    }
    
    setIsModalVisible(true);
  };

  // Close Modal
  const closeModal = (): void => {
    setIsModalVisible(false);
    setSelectedProduct(null);
    form.resetFields();
  };

  // Handle Save for both Add and Edit
  const handleSave = async (): Promise<void> => {
    try {
      const values: ProductFormValues = await form.validateFields();
      
      if (modalMode === 'add') {
        // Add new product
        const newProduct: Product = {
          id: Math.max(0, ...products.map(p => p.id)) + 1,
          name: values.name,
          category: values.category,
          price: Number(values.price),
          stock: Number(values.stock),
          description: values.description
        };
        
        setProducts([...products, newProduct]);
        message.success('Product added successfully');
      } else if (modalMode === 'edit' && selectedProduct) {
        // Update existing product
        const updatedProducts = products.map(product => 
          product.id === selectedProduct.id 
            ? { 
                ...selectedProduct, 
                ...values,
                price: Number(values.price),
                stock: Number(values.stock)
              }
            : product
        );
        
        setProducts(updatedProducts);
        message.success('Product updated successfully');
      }
      
      closeModal();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // Delete Product

  const handleDelete = (productId: number): void => {
  const product = products.find((p) => p.id === productId);

  const confirmDelete = window.confirm(
    product
      ? `Are you sure you want to permanently delete "${product.name}"?`
      : "Are you sure you want to permanently delete this product?"
  );

  if (confirmDelete) {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    alert("Product deleted successfully"); // or use toast/message if you have one
  }
};


  // Get modal title based on mode
  const getModalTitle = (): string => {
    switch (modalMode) {
      case 'add':
        return 'Add New Product';
      case 'edit':
        return `Edit Product - ${selectedProduct?.name}`;
      case 'view':
        return `Product Details - ${selectedProduct?.name}`;
      default:
        return 'Product';
    }
  };

  // Get modal footer buttons based on mode
  const getModalFooter = (): React.ReactNode[] => {
    const baseButtons = [
      <Button key="cancel" onClick={closeModal}>
        {modalMode === 'view' ? 'Close' : 'Cancel'}
      </Button>
    ];

    if (modalMode === 'view') {
      return [
        ...baseButtons,
        <Button 
          key="edit" 
          type="primary" 
          onClick={() => openModal('edit', selectedProduct!)}
        >
          Edit Product
        </Button>
      ];
    }

    return [
      ...baseButtons,
      <Button 
        key="save" 
        type="primary" 
        onClick={handleSave}
      >
        {modalMode === 'add' ? 'Add Product' : 'Save Changes'}
      </Button>
    ];
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
      filters: [
        { text: 'Electronics', value: 'Electronics' },
        { text: 'Furniture', value: 'Furniture' },
        { text: 'Kitchen', value: 'Kitchen' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
      render: (stock: number) => (
        <span style={{ color: stock < 10 ? '#ff4d4f' : stock < 20 ? '#faad14' : '#52c41a' }}>
          {stock}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record: Product) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => openModal('view', record)}
          >
            View
          </Button>
          <Button 
            type="default" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => openModal('edit', record)}
          >
            Edit
          </Button>
          <Button 
            danger
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Product Management</span>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => openModal('add')}
            >
              Add Product
            </Button>
          </div>
        }
      >
        <Table 
          columns={columns} 
          dataSource={products} 
          rowKey="id"
          pagination={{ 
            pageSize: 5,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `Showing ${range[0]}-${range[1]} of ${total} products`
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Single Modal for All Operations */}
      <Modal
        title={getModalTitle()}
        open={isModalVisible}
        onCancel={closeModal}
        footer={getModalFooter()}
        width={600}
        destroyOnClose={true}
      >
        <ProductForm 
          form={form}
          mode={modalMode}
          initialValues={selectedProduct ? {
            name: selectedProduct.name,
            category: selectedProduct.category,
            price: selectedProduct.price,
            stock: selectedProduct.stock,
            description: selectedProduct.description || ''
          } : undefined}
        />
      </Modal>
    </div>
  );
};

export default ProductList;