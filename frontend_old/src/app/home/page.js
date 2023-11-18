'use client';

import React from 'react';
import { Row, Col, Card, Calendar, Typography, Space } from 'antd';
import {
  ReadOutlined,
  TeamOutlined,
  BookOutlined,
  FormOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const { Title, Text } = Typography;

const DashboardPage = () => {
  const router = useRouter();

  const userRole = 'Admin';

  const handleTileClick = (url) => {
    router.push(url);
  };

  const tiles = [
    {
      icon: <ReadOutlined />,
      title: 'Assignments',
      count: '20',
      color: '#1890ff',
      url: '/home/results',
      roles: ['Faculty', 'Student', 'Admin'],
    },
    {
      icon: <TeamOutlined />,
      title: 'Department',
      count: '4',
      color: '#13c2c2',
      url: '/home/department',
      roles: ['Admin'],
    },
    {
      icon: <BookOutlined />,
      title: 'Courses',
      count: '12',
      color: '#722ed1',
      url: '/home/courses',
      roles: ['Faculty', 'Student', 'Admin'],
    },
    {
      icon: <FormOutlined />,
      title: 'Exams',
      count: '8',
      color: '#eb2f96',
      url: '/home/results',
      roles: ['Faculty', 'Student', 'Admin'],
    },
    {
      icon: <BarChartOutlined />,
      title: 'Total Marks',
      count: '85%',
      color: '#fa8c16',
      url: '/home/results',
      roles: ['Faculty', 'Student', 'Admin'],
    },
    {
      icon: <UserOutlined />,
      title: 'Users',
      color: '#52c41a',
      url: '/home/users',
      roles: ['Admin'],
    },
    {
      icon: <BookOutlined />,
      title: 'Course List',
      color: '#faad14',
      url: '/home/courselist',
      roles: ['Faculty', 'Student', 'Admin'],
    },
    {
      icon: <LogoutOutlined />,
      title: 'Logout',
      color: '#f5222d',
      url: '/login',
      roles: ['Admin', 'Faculty', 'Student'],
    },
  ];

  const HomepageContainer = styled.div`
    margin-top: 10px;
    margin-left: 250px;
    background: linear-gradient(to right, #e6f7ff, #ffffff);
    height: 100vh;
  `;

  const HomepageCardStyle = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    height: 150px;
  `;

  const accessibleTiles = tiles.filter((tile) => tile.roles.includes(userRole));

  return (
    <HomepageContainer>
      <Title level={1}>Homepage</Title>
      <Row gutter={16}>
        {accessibleTiles.map(({ icon, title, count, color, url }, index) => (
          <Col
            span={6}
            key={title}
            style={{ marginBottom: index < 4 ? '25px' : '0px' }}
          >
            <HomepageCardStyle hoverable onClick={() => handleTileClick(url)}>
              <Space direction="vertical" size="middle" align="center">
                <span style={{ fontSize: '45px', color }}>{icon}</span>
                <Text strong>{title}</Text>
                {count && <Text>{count}</Text>}
              </Space>
            </HomepageCardStyle>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: '125px', marginBottom: '100px' }}>
        <Title level={2}>Calendar</Title>
        <div
          style={{
            border: '1px solid #f0f0f0',
            borderRadius: '4px',
            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Calendar fullscreen={false} />
        </div>
      </div>
    </HomepageContainer>
  );
};

export default DashboardPage;
