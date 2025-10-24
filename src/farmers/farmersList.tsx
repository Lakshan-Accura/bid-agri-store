// import React, { useState, useEffect } from 'react';
// import {
//   Table,
//   Button,
//   Space,
//   Tag,
//   Card,
//   Input,
//   Select,
//   Row,
//   Col,
//   message,
//   Popconfirm,
//   Modal
// } from 'antd';
// import { 
//   PlusOutlined, 
//   EditOutlined, 
//   DeleteOutlined, 
//   EyeOutlined,
//   SearchOutlined 
// } from '@ant-design/icons';
// import type { ColumnsType } from 'antd/es/table';

// const { Option } = Select;
// const { Search } = Input;

// interface FarmersListProps {
//   onAddFarmer: () => void;
//   onEditFarmer: (farmer: FarmerData) => void;
//   onViewFarmer: (farmer: FarmerData) => void;
// }

// const FarmersList: React.FC<FarmersListProps> = ({ 
//   onAddFarmer, 
//   onEditFarmer, 
//   onViewFarmer 
// }) => {
//   const [farmers, setFarmers] = useState<FarmerData[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [searchText, setSearchText] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');

//   // Mock data - replace with actual API call
//   useEffect(() => {
//     loadFarmers();
//   }, []);

//   const loadFarmers = async () => {
//     setLoading(true);
//     try {
//       // Mock data
//       const mockFarmers: FarmerData[] = [
//         {
//           id: 1,
//           firstName: 'John',
//           lastName: 'Doe',
//           email: 'john@example.com',
//           phone: '+1234567890',
//           address: '123 Farm Road, Agricultural City',
//           farmName: 'Green Valley Farms',
//           farmSize: 50,
//           farmLocation: 'Agricultural City',
//           crops: ['Corn', 'Wheat'],
//           experience: 5,
//           joinDate: '2023-01-15',
//           isActive: true
//         },
//         {
//           id: 2,
//           firstName: 'Jane',
//           lastName: 'Smith',
//           email: 'jane@example.com',
//           phone: '+1234567891',
//           address: '456 Farm Lane, Rural Town',
//           farmName: 'Sunshine Farms',
//           farmSize: 30,
//           farmLocation: 'Rural Town',
//           crops: ['Vegetables', 'Fruits'],
//           experience: 3,
//           joinDate: '2023-03-20',
//           isActive: false
//         }
//       ];
//       setFarmers(mockFarmers);
//     } catch (error) {
//       message.error('Failed to load farmers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       // await deleteFarmer(id);
//       setFarmers(farmers.filter(farmer => farmer.id !== id));
//       message.success('Farmer deleted successfully');
//     } catch (error) {
//       message.error('Failed to delete farmer');
//     }
//   };

//   const filteredFarmers = farmers.filter(farmer => {
//     const matchesSearch = farmer.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
//                          farmer.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
//                          farmer.farmName.toLowerCase().includes(searchText.toLowerCase()) ||
//                          farmer.email.toLowerCase().includes(searchText.toLowerCase());
    
//     const matchesStatus = statusFilter === 'all' || 
//                          (statusFilter === 'active' && farmer.isActive) ||
//                          (statusFilter === 'inactive' && !farmer.isActive);
    
//     return matchesSearch && matchesStatus;
//   });

//   const columns: ColumnsType<FarmerData> = [
//     {
//       title: 'Name',
//       dataIndex: 'firstName',
//       key: 'name',
//       render: (_, record) => `${record.firstName} ${record.lastName}`,
//       sorter: (a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
//     },
//     {
//       title: 'Farm Name',
//       dataIndex: 'farmName',
//       key: 'farmName',
//       sorter: (a, b) => a.farmName.localeCompare(b.farmName)
//     },
//     {
//       title: 'Email',
//       dataIndex: 'email',
//       key: 'email',
//     },
//     {
//       title: 'Phone',
//       dataIndex: 'phone',
//       key: 'phone',
//     },
//     {
//       title: 'Farm Size',
//       dataIndex: 'farmSize',
//       key: 'farmSize',
//       render: (size) => `${size} acres`,
//       sorter: (a, b) => a.farmSize - b.farmSize
//     },
//     {
//       title: 'Crops',
//       dataIndex: 'crops',
//       key: 'crops',
//       render: (crops: string[]) => (
//         <Space wrap>
//           {crops.slice(0, 2).map((crop, index) => (
//             <Tag key={index} color="blue">{crop}</Tag>
//           ))}
//           {crops.length > 2 && <Tag>+{crops.length - 2} more</Tag>}
//         </Space>
//       )
//     },
//     {
//       title: 'Status',
//       dataIndex: 'isActive',
//       key: 'isActive',
//       render: (isActive: boolean) => (
//         <Tag color={isActive ? 'green' : 'red'}>
//           {isActive ? 'Active' : 'Inactive'}
//         </Tag>
//       ),
//       filters: [
//         { text: 'Active', value: 'active' },
//         { text: 'Inactive', value: 'inactive' },
//       ],
//       onFilter: (value, record) => 
//         value === 'active' ? record.isActive : !record.isActive,
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Space>
//           <Button 
//             type="link" 
//             icon={<EyeOutlined />} 
//             onClick={() => onViewFarmer(record)}
//             size="small"
//           >
//             View
//           </Button>
//           <Button 
//             type="link" 
//             icon={<EditOutlined />} 
//             onClick={() => onEditFarmer(record)}
//             size="small"
//           >
//             Edit
//           </Button>
//           <Popconfirm
//             title="Delete Farmer"
//             description="Are you sure you want to delete this farmer?"
//             onConfirm={() => handleDelete(record.id!)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button 
//               type="link" 
//               danger 
//               icon={<DeleteOutlined />} 
//               size="small"
//             >
//               Delete
//             </Button>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <Card 
//       title="Farmers Management"
//       extra={
//         <Button 
//           type="primary" 
//           icon={<PlusOutlined />} 
//           onClick={onAddFarmer}
//         >
//           Add Farmer
//         </Button>
//       }
//     >
//       <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
//         <Col xs={24} sm={12} md={8}>
//           <Search
//             placeholder="Search farmers..."
//             allowClear
//             enterButton={<SearchOutlined />}
//             size="large"
//             onSearch={setSearchText}
//             onChange={(e) => setSearchText(e.target.value)}
//           />
//         </Col>
//         <Col xs={24} sm={12} md={4}>
//           <Select
//             placeholder="Status"
//             value={statusFilter}
//             onChange={setStatusFilter}
//             style={{ width: '100%' }}
//             size="large"
//           >
//             <Option value="all">All Status</Option>
//             <Option value="active">Active</Option>
//             <Option value="inactive">Inactive</Option>
//           </Select>
//         </Col>
//       </Row>

//       <Table
//         columns={columns}
//         dataSource={filteredFarmers}
//         rowKey="id"
//         loading={loading}
//         scroll={{ x: 800 }}
//         pagination={{
//           pageSize: 10,
//           showSizeChanger: true,
//           showQuickJumper: true,
//           showTotal: (total, range) => 
//             `${range[0]}-${range[1]} of ${total} farmers`
//         }}
//       />
//     </Card>
//   );
// };

// export default FarmersList;