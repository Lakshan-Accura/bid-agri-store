// components/TenantList.tsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Card,
  Form,
  Tag,
  Alert,
  Spin,
  ConfigProvider,
  Popconfirm 
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import TenantForm, { type Tenant, type TenantFormValues } from './tenantForm';
import AddTenantAdminForm from './AddTenantAdminForm';
import { useTenantStore } from '../store/tenantStore';
import type { UpdateTenantRequest } from '../endpoints/tenantsEndpoints/tenants';
import { brandColors, themeConfig } from '../config/color';

const TenantList: React.FC = () => {
  const {
    tenants,
    isLoading,
    error,
    fetchTenants,
    createTenant,
    updateTenant,
    deleteTenant,
    clearError,
  } = useTenantStore();

  const [isTenantModalVisible, setIsTenantModalVisible] = useState(false);
  const [isAdminModalVisible, setIsAdminModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [form] = Form.useForm();

  /** 🔄 Load Tenants on mount */
  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  /** 🧹 Auto clear errors */
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  /** 📦 Open Tenant Modal (Add/Edit/View) */
  const openTenantModal = (mode: 'add' | 'edit' | 'view', tenant?: Tenant) => {
    setModalMode(mode);
    setSelectedTenant(tenant || null);

    if (mode === 'add') {
      form.resetFields();
    } else if (tenant) {
      form.setFieldsValue({
        tenantCode: tenant.tenantCode,
        tenantName: tenant.tenantName,
        enabled: tenant.enabled,
      });
    }

    setIsTenantModalVisible(true);
  };

  const closeTenantModal = () => {
    setIsTenantModalVisible(false);
    setSelectedTenant(null);
    form.resetFields();
  };

  /** 👤 Admin Creation Modal */
  const openAdminModal = () => setIsAdminModalVisible(true);
  const closeAdminModal = () => setIsAdminModalVisible(false);

  /** 💾 Save Tenant (Add/Edit) */
  const handleSaveTenant = async () => {
    try {
      const values: TenantFormValues = await form.validateFields();

      if (modalMode === 'add') {
        const result = await createTenant({
          tenantCode: values.tenantCode,
          tenantName: values.tenantName,
          enabled: values.enabled,
        });
        if (result) {
          message.success('Agri Store created successfully');
          closeTenantModal();
        }
      } else if (modalMode === 'edit' && selectedTenant?.id) {
        const updateData: UpdateTenantRequest = {
          id: selectedTenant.id,
          tenantCode: values.tenantCode,
          tenantName: values.tenantName,
          enabled: values.enabled
        };

        const result = await updateTenant(selectedTenant.id, updateData);
        if (result) {
          message.success('Agri Store updated successfully');
          closeTenantModal();
        } else {
          message.error('Failed to update Agri Store');
        }
      }
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Please fill all required fields correctly.');
    }
  };

/** 🗑️ Delete Tenant */
const handleDeleteTenant = async (tenantId: number) => {
  try {
    await deleteTenant(tenantId);
    message.success('Agri Store deleted successfully');
  } catch {
    message.error('Failed to delete Agri Store');
  }
};


  /** 🧾 Modal Title & Footer */
  const getTenantModalTitle = () => {
    switch (modalMode) {
      case 'add':
        return 'Add New Agri Store';
      case 'edit':
        return `Edit Agri Store - ${selectedTenant?.tenantName}`;
      case 'view':
        return `Agri Store Details - ${selectedTenant?.tenantName}`;
      default:
        return 'Agri Store';
    }
  };

  const getTenantModalFooter = () => {
    const base = [
      <Button key="cancel" onClick={closeTenantModal}>
        {modalMode === 'view' ? 'Close' : 'Cancel'}
      </Button>,
    ];

    if (modalMode === 'view') {
      return [
        ...base,
        <Button
          key="edit"
          type="primary"
          onClick={() => openTenantModal('edit', selectedTenant!)}
          style={{
            backgroundColor: brandColors.primary,
            borderColor: brandColors.primary,
          }}
        >
          Edit Agri Store
        </Button>,
      ];
    }

    return [
      ...base,
      <Button
        key="save"
        type="primary"
        loading={isLoading}
        onClick={handleSaveTenant}
        style={{
          backgroundColor: brandColors.primary,
          borderColor: brandColors.primary,
        }}
      >
        {modalMode === 'add' ? 'Add Agri Store' : 'Save Changes'}
      </Button>,
    ];
  };

  /** 📋 Table Columns */
  const columns: ColumnsType<Tenant> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      sorter: (a, b) => (a.id || 0) - (b.id || 0),
    },
    {
      title: 'Agri Store Code',
      dataIndex: 'tenantCode',
      key: 'tenantCode',
      sorter: (a, b) => a.tenantCode.localeCompare(b.tenantCode),
      render: (code: string) => (
        <Tag
          style={{
            fontFamily: 'monospace',
            fontWeight: 'bold',
            backgroundColor: brandColors.tagSuccessBg,
            color: brandColors.tagSuccessText,
          }}
        >
          {code}
        </Tag>
      ),
    },
    {
      title: 'Agri Store Name',
      dataIndex: 'tenantName',
      key: 'tenantName',
      sorter: (a, b) => a.tenantName.localeCompare(b.tenantName),
    },
    {
      title: 'Status',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
  
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => openTenantModal('view', record)}
            style={{
              backgroundColor: brandColors.primary,
              borderColor: brandColors.primary,
            }}
          >
            View
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => openTenantModal('edit', record)}
            style={{
              color: brandColors.primary,
              borderColor: brandColors.primary,
            }}
          >
            Edit
          </Button>
       <Popconfirm
  title={`Are you sure you want to delete "${record.tenantName}"?`}
  onConfirm={() => record.id && handleDeleteTenant(record.id)}
  okText="Yes"
  cancelText="No"
>
  <Button danger icon={<DeleteOutlined />} size="small">
    Delete
  </Button>
</Popconfirm>


        </Space>
      ),
    },
  ];

  /** 🧱 Render */
  return (
    <ConfigProvider theme={themeConfig}>
      <div style={{ padding: '24px' }}>
        <Card
          title={
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: brandColors.primary, fontWeight: 'bold' }}>
                Agri Store Management
              </span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={openAdminModal}
                  style={{
                    backgroundColor: brandColors.primary,
                    borderColor: brandColors.primary,
                  }}
                >
                  Add Agri Store Admin
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => openTenantModal('add')}
                  style={{
                    backgroundColor: brandColors.primary,
                    borderColor: brandColors.primary,
                  }}
                >
                  Add Agri Store
                </Button>
              </div>
            </div>
          }
          bordered={false}
        >
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={clearError}
              style={{ marginBottom: 16 }}
            />
          )}

          {isLoading && tenants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>Loading Agri Stores...</div>
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={tenants.map((t) => ({ ...t, key: t.id }))}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '20', '50'],
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `Showing ${range[0]}-${range[1]} of ${total} Agri Stores`,
              }}
              scroll={{ x: 800 }}
            />
          )}
        </Card>

        {/* Tenant Add/Edit/View Modal */}
        <Modal
          title={
            <span style={{ color: brandColors.primary }}>
              {getTenantModalTitle()}
            </span>
          }
          open={isTenantModalVisible}
          onCancel={closeTenantModal}
          footer={getTenantModalFooter()}
          width={600}
          destroyOnClose
        >
          <TenantForm
            form={form}
            mode={modalMode}
            initialValues={
              selectedTenant
                ? {
                    tenantCode: selectedTenant.tenantCode,
                    tenantName: selectedTenant.tenantName,
                    enabled: selectedTenant.enabled
                  }
                : undefined
            }
          />
        </Modal>

        {/* Admin Creation Modal */}
        <Modal
          title={
            <span style={{ color: brandColors.primary }}>
              Add Agri Store Admin
            </span>
          }
          open={isAdminModalVisible}
          onCancel={closeAdminModal}
          footer={null}
          width={700}
          destroyOnClose
        >
          <AddTenantAdminForm />
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default TenantList;
