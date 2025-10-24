// components/ProductList.tsx
import React, { useState } from 'react';
import { Table, Button, Space, Modal, message, Card, Form, Tag } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import UserForm, { type User, type UserFormValues } from './userForm.tsx';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { 
      id: 1, 
      name: 'John Brown', 
      age: 32, 
      address: 'New York No. 1 Lake Park', 
      tags: ['nice', 'developer'],
      email: 'john@example.com',
      phone: '+1-555-0123'
    },
    { 
      id: 2, 
      name: 'Jim Green', 
      age: 42, 
      address: 'London No. 1 Lake Park', 
      tags: ['loser'],
      email: 'jim@example.com',
      phone: '+44-555-0123'
    },
    { 
      id: 3, 
      name: 'Joe Black', 
      age: 32, 
      address: 'Sydney No. 1 Lake Park', 
      tags: ['cool', 'teacher'],
      email: 'joe@example.com',
      phone: '+61-555-0123'
    },
    { 
      id: 4, 
      name: 'Alice Smith', 
      age: 28, 
      address: 'Paris No. 2 Lake Park', 
      tags: ['designer'],
      email: 'alice@example.com',
      phone: '+33-555-0123'
    },
    { 
      id: 5, 
      name: 'Bob White', 
      age: 36, 
      address: 'Berlin No. 3 Lake Park', 
      tags: ['manager'],
      email: 'bob@example.com',
      phone: '+49-555-0123'
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [form] = Form.useForm();

  // Open Modal with specific mode
  const openModal = (mode: 'add' | 'edit' | 'view', user?: User): void => {
    setModalMode(mode);
    setSelectedUser(user || null);
    
    if (mode === 'add') {
      form.resetFields();
    } else if (user) {
      form.setFieldsValue({
        name: user.name,
        age: user.age,
        address: user.address,
        tags: user.tags,
        email: user.email,
        phone: user.phone
      });
    }
    
    setIsModalVisible(true);
  };

  // Close Modal
  const closeModal = (): void => {
    setIsModalVisible(false);
    setSelectedUser(null);
    form.resetFields();
  };

  // Handle Save for both Add and Edit
  const handleSave = async (): Promise<void> => {
    try {
      const values: UserFormValues = await form.validateFields();
      
      if (modalMode === 'add') {
        // Add new product
        const newUser: User = {
          id: Math.max(0, ...users.map(u => u.id)) + 1,
          name: values.name,
          age: Number(values.age),
          address: values.address,
          tags: values.tags,
          email: values.email,
          phone: values.phone
        };
        
        setUsers([...users, newUser]);
        message.success('User added successfully');
      } else if (modalMode === 'edit' && selectedUser) {
        // Update existing user
        const updatedUsers = users.map(user => 
          user.id === selectedUser.id 
            ? { 
                ...selectedUser, 
                ...values,
                name: values.name,
                age: values.age,
                address: values.address,
                tags: values.tags,
                email: values.email,
                phone: values.phone,
              }
            : user
        );
        
        setUsers(updatedUsers);
        message.success('User updated successfully');
      }
      
      closeModal();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

// Delete User
const handleDelete = (userId: number): void => {
  const user = users.find((u) => u.id === userId);

  const confirmDelete = window.confirm(
    user
      ? `Are you sure you want to permanently delete "${user.name}"?`
      : "Are you sure you want to permanently delete this user?"
  );

  if (confirmDelete) {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    alert("User deleted successfully"); // Or use your own toast system
  }
};


  // Get modal title based on mode
  const getModalTitle = (): string => {
    switch (modalMode) {
      case 'add':
        return 'Add New User';
      case 'edit':
        return `Edit User - ${selectedUser?.name}`;
      case 'view':
        return `User Details - ${selectedUser?.name}`;
      default:
        return 'User';
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
          onClick={() => openModal('edit', selectedUser!)}
        >
          Edit User
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
        {modalMode === 'add' ? 'Add User' : 'Save Changes'}
      </Button>
    ];
  };

  const columns: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
     },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      dataIndex: 'tag',
      key: 'tags',
    },
     {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
     {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record: User) => (
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
            <span>User Management</span>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => openModal('add')}
            >
              Add User
            </Button>
          </div>
        }
      >
        <Table 
          columns={columns} 
          dataSource={users} 
          rowKey="id"
          pagination={{ 
            pageSize: 5,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `Showing ${range[0]}-${range[1]} of ${total} users`
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
        <UserForm 
          form={form}
          mode={modalMode}
          initialValues={selectedUser ? {
            name: selectedUser.name,
            age: selectedUser.age,
            address: selectedUser.address,
            tags: selectedUser.tags,
            email: selectedUser.email,
            phone: selectedUser.phone    
          } : undefined}
        />
      </Modal>
    </div>
  );
};

export default UsersList;