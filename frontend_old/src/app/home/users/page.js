"use client"
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Table } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Content, Sider } = Layout;

const StyledContent = styled(Content)`
  background: #fff;
  padding: 24px;
  margin-left: 250px; // Adjust according to your sidebar width
`;

const StyledTable = styled(Table)`
  margin: 20px;
  border-radius: 8px;
`;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Replace with your actual API call
    const fetchUsers = async () => {
      const response = await fetch('https://your-api-endpoint/users');
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
      },
    // Add more columns as needed
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      
      <StyledContent>
        <StyledTable
          columns={columns}
          dataSource={users}
          rowKey="id" // Adjust this according to your data's unique key
        />
      </StyledContent>
    </Layout>
  );
};

export default UsersPage;