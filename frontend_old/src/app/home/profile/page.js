"use client"

import React, { useState,useEffect } from "react";
import styled from "styled-components";
import { Button, Input, Avatar, Upload, Tabs, message } from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  SaveOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  IdcardOutlined,
  BookOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;

const colorPalette = {
  primary: '#1890ff',
  green: '#52c41a',
  red: '#ff4d4f',
  text: '#333',
  background: '#e9f1f6',
};

const ProfileBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${colorPalette.background};
  width: 100%;
  min-height: 100vh;
  padding: 20px;
`;

const ProfileInnerContainer = styled.div`
  background-color: white;
  border-radius: 15px;
  width: 80%;
  max-width: 800px;
  margin: auto;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
  padding: 40px;
  display: flex;
  flex-direction: column;
`;

const ProfileField = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  & > label {
    width: 200px;
    font-weight: bold;
    color: ${colorPalette.text};
    display: flex;
    align-items: center;

    svg {
      margin-right: 8px;
    }
  }
`;

const ProfileInput = styled(Input)`
  flex-grow: 1;
  border-radius: 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const StyledButton = styled(Button)`
  flex-grow: 1;
  padding: 10px 30px;
  font-size: 16px;
  border-radius: 5px;
  color: white;
  margin: 10px 10px;
  display: flex;         
  justify-content: center; 
  align-items: center;  
  &:hover {
    opacity: 0.8;
  }
`;


const UploadButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px dashed #d9d9d9;
  padding: 15px;
  border-radius: 5px;
`;

const getFieldIcon = (fieldName) => {
  switch (fieldName) {
    case 'ID: Username': return <IdcardOutlined />;
    case 'First Name': return <UserOutlined />;
    case 'Last Name': return <UserOutlined />;
    case 'Middle Name': return <UserOutlined />;
    case 'Email': return <MailOutlined />;
    case 'Phone': return <PhoneOutlined />;
    case 'Gender': return <SettingOutlined />;
    case 'Role': return <SettingOutlined />;
    case 'College ID': return <IdcardOutlined />;
    case 'Department ID': return <IdcardOutlined />;
    case 'Enrollment Year': return <CalendarOutlined />;
    case 'Employment Year': return <CalendarOutlined />;
    case 'Course Type': 
    case 'Employment Type': 
    case 'Domain': return <BookOutlined />;
    default: return null;
  }
};

const ProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [userRole, setUserRole] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Add logic here to filter or fetch data based on the search term
  };

  const PROFILE_FIELDS = {
    'Admin': ['ID: Username', 'First Name', 'Last Name', 'Middle Name', 'Email', 'Phone', 'Gender', 'Role'],
    'Student': ['ID: Username', 'First Name', 'Last Name', 'Middle Name', 'Email', 'Phone', 'Gender', 'Role', 'College ID', 'Enrollment Year', 'Course Type'],
    'Faculty': ['ID: Username', 'First Name', 'Last Name', 'Middle Name', 'Email', 'Phone', 'Gender', 'Role', 'Employment Type', 'Domain', 'Employment Year', 'Department ID']
  };

  const renderProfileFields = (fields) => {
    return fields.map(field => (
      <ProfileField key={field}>
        <label>{getFieldIcon(field)} {field}</label>
        <ProfileInput placeholder={field} disabled={userRole !== 'Admin'} />
      </ProfileField>
    ));
  };

  useEffect(() => {
    // Fetch user role from the API (Simulated)
    const fetchUserRole = async () => {
      // Simulate an API call
      const mockApiResponse = (success = true) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (success) {
              resolve({ data: { role: 'Admin' } }); // Simulate success response
            } else {
              reject(new Error('Failed to fetch user role')); // Simulate error response
            }
          }, 10);
        });
      };

      // Test: Change the argument to false to simulate an error
      mockApiResponse(true)
        .then((response) => {
          // Set user role based on the response
          setUserRole(response.data.role);
        })
        .catch((error) => {
          console.error('Error fetching user role:', error);
        });
    };

    fetchUserRole();
  }, []);

  // Before upload check
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG files!');
      return Upload.LIST_IGNORE;  // Updated to use LIST_IGNORE for antd v4
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return Upload.LIST_IGNORE;  // Updated to use LIST_IGNORE for antd v4
  }
  return true;
};

// Upload change handler
const handleUploadChange = (info) => {
  if (info.file.status === 'uploading') {
      setLoading(true);
      return;
  }
  if (info.file.status === 'done') {
      // Create a URL for the uploaded file
      setImageUrl(URL.createObjectURL(info.file.originFileObj));
      setLoading(false);
  } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
      setLoading(false);
  }
};

  

  const uploadButton = (
    <UploadButton>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload Avatar</div>
    </UploadButton>
  );

  return (
    <ProfileBody>
      <ProfileInnerContainer>
      {userRole === 'Admin' && (
          <div style={{ marginBottom: 20 }}>
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        )}
        <Tabs defaultActiveKey="1" type="card">
          {Object.keys(PROFILE_FIELDS).map((role, index) => (
            userRole === 'Admin' || userRole === role ?
            <TabPane tab={role} key={index + 1}>
              {renderProfileFields(PROFILE_FIELDS[role])}
            </TabPane> : null
          ))}
        </Tabs>
        <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleUploadChange}
        accept="image/jpeg, image/png"
      >
        {imageUrl ? <Avatar size={128} src={imageUrl} /> : uploadButton}
      </Upload>
        {userRole === 'Admin' && (
          <ButtonGroup>
            <StyledButton icon={<PlusCircleOutlined />} style={{ backgroundColor: '#4CAF50' }}>Create</StyledButton>
            <StyledButton icon={<EditOutlined />} style={{ backgroundColor: '#ff9800' }}>Update</StyledButton>
            <StyledButton icon={<DeleteOutlined />} style={{ backgroundColor: '#f44336' }}>Delete</StyledButton>
          </ButtonGroup>
        )}
      </ProfileInnerContainer>
    </ProfileBody>
  );
}

export default ProfilePage;
