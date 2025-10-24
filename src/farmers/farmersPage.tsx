// import React, { useState } from 'react';
// import { Layout, Space, Typography } from 'antd';
// import FarmersList from './farmersList';
// import FarmersForm, {type FarmerData } from './farmersForm';

// const { Content } = Layout;
// const { Title } = Typography;

// type PageMode = 'list' | 'add' | 'edit' | 'view';

// const FarmersPage: React.FC = () => {
//   const [currentMode, setCurrentMode] = useState<PageMode>('list');
//   const [selectedFarmer, setSelectedFarmer] = useState<FarmerData | null>(null);

//   const handleAddFarmer = () => {
//     setSelectedFarmer(null);
//     setCurrentMode('add');
//   };

//   const handleEditFarmer = (farmer: FarmerData) => {
//     setSelectedFarmer(farmer);
//     setCurrentMode('edit');
//   };

//   const handleViewFarmer = (farmer: FarmerData) => {
//     setSelectedFarmer(farmer);
//     setCurrentMode('view');
//   };

//   const handleSaveFarmer = (data: FarmerData) => {
//     console.log('Farmer saved:', data);
//     // Here you would typically make API calls to save the data
//     setCurrentMode('list');
//     setSelectedFarmer(null);
//   };

//   const handleCancel = () => {
//     setCurrentMode('list');
//     setSelectedFarmer(null);
//   };

//   const renderContent = () => {
//     switch (currentMode) {
//       case 'add':
//         return (
//           <FarmersForm
//             mode="add"
//             onSave={handleSaveFarmer}
//             onCancel={handleCancel}
//           />
//         );
      
//       case 'edit':
//         return (
//           <FarmersForm
//             mode="edit"
//             farmerData={selectedFarmer!}
//             onSave={handleSaveFarmer}
//             onCancel={handleCancel}
//           />
//         );
      
//       case 'view':
//         return (
//           <FarmersForm
//             mode="view"
//             farmerData={selectedFarmer!}
//             onCancel={handleCancel}
//           />
//         );
      
//       case 'list':
//       default:
//         return (
//           <FarmersList
//             onAddFarmer={handleAddFarmer}
//             onEditFarmer={handleEditFarmer}
//             onViewFarmer={handleViewFarmer}
//           />
//         );
//     }
//   };

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       <Content style={{ padding: '24px' }}>
//         <Space direction="vertical" size="large" style={{ width: '100%' }}>
//           <div>
//             <Title level={2}>Farmers Management</Title>
//             <p>Manage all farmers in the system</p>
//           </div>
//           {renderContent()}
//         </Space>
//       </Content>
//     </Layout>
//   );
// };

// export default FarmersPage;