"use client";

import React, { useState, useEffect } from 'react';
import { Table, Button, Typography, Input, DatePicker, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const SIDEBAR_WIDTH = '250px';

const { Title } = Typography;
const { TextArea } = Input;

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
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

const FormCard = styled.div`

  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const StyledInput = styled(Input)`
  margin-bottom: 1rem;
`;

const StyledTextArea = styled(TextArea)`
  margin-bottom: 1rem;
`;

const StyledDatePicker = styled(DatePicker)`
  margin-bottom: 1rem;
  width: 100%;
`;

const StyledInputNumber = styled(InputNumber)`
  margin-bottom: 1rem;
  width: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledButton = styled(Button)`
  flex-grow: 1;
`;

const EntityManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: null,
    endDate: null,
    credits: 0,
  });
  const userRole = 'Faculty'; // Assume user role is 'Admin', 'Faculty', or 'Student'

  useEffect(() => {
    // Replace with your actual API call to fetch courses
    setCourses([
      { id: 1, name: 'Mathematics', description: 'Math course', startDate: '2021-09-01', endDate: '2022-05-30', credits: 4 },
      // ... other courses ...
    ]);
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handlers for CRUD operations
  const handleCreate = () => {
    console.log('Create', formData);
    // Add logic to create a course
  };

  const handleUpdate = () => {
    console.log('Update', formData);
    // Add logic to update a course
  };

  const handleDelete = () => {
    console.log('Delete', formData);
    // Add logic to delete a course
  };

  const courseColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate' },
    { title: 'Credits', dataIndex: 'credits', key: 'credits' },
  ];

  return (
    <PageContainer>
      <ContentContainer>
        {userRole === 'Admin' && (
          <FormCard>
            <Title level={4}>Course Management</Title>
            <StyledInput
              placeholder="Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <StyledTextArea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
            <StyledDatePicker
              placeholder="Start Date"
              value={formData.startDate && moment(formData.startDate)}
              onChange={(date, dateString) => handleChange('startDate', dateString)}
            />
            <StyledDatePicker
              placeholder="End Date"
              value={formData.endDate && moment(formData.endDate)}
              onChange={(date, dateString) => handleChange('endDate', dateString)}
            />
            <StyledInputNumber
              placeholder="Credits"
              min={0}
              value={formData.credits}
              onChange={(value) => handleChange('credits', value)}
            />
            <ButtonGroup>
              <StyledButton icon={<PlusOutlined />} onClick={handleCreate}>Create</StyledButton>
              <StyledButton icon={<EditOutlined />} onClick={handleUpdate}>Update</StyledButton>
              <StyledButton icon={<DeleteOutlined />} onClick={handleDelete}>Delete</StyledButton>
            </ButtonGroup>
          </FormCard>
        )}
        <Table dataSource={courses} columns={courseColumns} rowKey="id" />
      </ContentContainer>
    </PageContainer>
  );
};

export default EntityManagementPage;
