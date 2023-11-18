"use client";

import React, { useState , useEffect } from 'react';
import { Table } from 'antd';

import styled from 'styled-components';
import { Button, Typography, Input } from 'antd';
import { IdcardOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const columns = [
    {
      title: 'Department ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Department Name',
      dataIndex: 'name',
      key: 'name',
    },
    // Add more columns as needed
  ];

const SIDEBAR_WIDTH = '250px';

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #e8eaf0;
`;

const ContentContainer = styled.div`
width: 1500px;
  margin-left: ${SIDEBAR_WIDTH};
  flex-grow: 1;
  display: flex;
  flex-direction: column; // Set the direction to column
  align-items: center;
  padding: 4rem;
  overflow-y: auto; // Allow for scrolling if content is too tall
  background-color: #f0f2f5;
`;

// Add a wrapper for the table if needed
const TableWrapper = styled.div`
  width: 100%;
  max-width: 800px; // Set a max-width if you want to constrain the table width
  margin-top: 10000rem; // Add some space between the form and the table
`;

const DepartmentCard = styled.div`
  padding: 2rem;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 200%; 
  width: 100%;
  margin-bottom: 20rem; // Add space between the card and table if needed
`;

const StyledTitle = styled(Title)`
  margin-bottom: 2rem;
`;

const StyledInput = styled(Input)`
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%; // Make the button group take full width of the card
`;

const ActionButton = styled(Button)`
  flex-grow: 1;
  margin: 0 4px; // Add some space between buttons
  color: white;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const AddButton = styled(ActionButton)`
  background-color: #52c41a; // Green color for add/create
  border-color: #52c41a;

  &:hover, &:focus {
    background-color: #73d13d;
    border-color: #73d13d;
  }
`;

const UpdateButton = styled(ActionButton)`
  background-color: #faad14; // Orange color for update
  border-color: #faad14;

  &:hover, &:focus {
    background-color: #ffc53d;
    border-color: #ffc53d;
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #ff4d4f; // Red color for delete
  border-color: #ff4d4f;

  &:hover, &:focus {
    background-color: #ff7875;
    border-color: #ff7875;
  }
`;

// Function to simulate API calls
const departmentApiCall = async ({ name, id, action }) => {
  console.log(`${action} department...`, name, id);
  // Here you would typically send a request to your backend server
  // For the purposes of this example, we're just logging to the console
  return { success: true }; // Simulate a successful response
};

function DepartmentPage() {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [departments, setDepartments] = useState([]);

//   useEffect(() => {
//     // Replace this with your actual backend API call to fetch departments
//     const fetchDepartments = async () => {
//       // Simulating a fetch call
//       const response = await new Promise((resolve) =>
//         setTimeout(() => resolve({ success: true, data: [{ id: '01', name: 'HR' }, { id: '02', name: 'IT' }] }), 1000)
//       );
      
//       if (response.success) {
//         setDepartments(response.data);
//       }
//     };

//     fetchDepartments();
//   }, []);


  const handleAddDepartment = async () => {
    const response = await departmentApiCall({ name, id, action: 'Adding' });
    if (response.success) {
      console.log('Department added successfully');
    }
  };

  const handleUpdateDepartment = async () => {
    const response = await departmentApiCall({ name, id, action: 'Updating' });
    if (response.success) {
      console.log('Department updated successfully');
    }
  };

  const handleDeleteDepartment = async () => {
    const response = await departmentApiCall({ name, id, action: 'Deleting' });
    if (response.success) {
      console.log('Department deleted successfully');
    }
  };

  return (
    <PageContainer>
      <ContentContainer>
        <DepartmentCard>
          <StyledTitle level={2}>Department Management</StyledTitle>
          <StyledInput
            size="large"
            placeholder="Department Name"
            prefix={<IdcardOutlined />}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <StyledInput
            size="large"
            placeholder="Department ID"
            prefix={<IdcardOutlined />}
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <ButtonGroup>
            <AddButton icon={<PlusOutlined />} onClick={handleAddDepartment}>
              Create
            </AddButton>
            <UpdateButton icon={<EditOutlined />} onClick={handleUpdateDepartment}>
              Update
            </UpdateButton>
            <DeleteButton icon={<DeleteOutlined />} onClick={handleDeleteDepartment}>
              Delete
            </DeleteButton>
          </ButtonGroup>
          <Table dataSource={departments} columns={columns} rowKey="id" />
        </DepartmentCard>
      </ContentContainer>
    </PageContainer>
  );
}

export default DepartmentPage;
