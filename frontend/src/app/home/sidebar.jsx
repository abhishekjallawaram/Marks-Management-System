'use client';

import React from 'react';
import Link from 'next/link';
import { Menu } from 'antd';
import {
  HomeOutlined,
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import authStore from '../../../store/authStore';
import { SERVER_URL } from '../../constants';
import useAuthStore from '../../../store/authStore';

const ROLE_NAV_ITEMS = {
  admin: [
    { title: 'Home', icon: <HomeOutlined />, path: '/home' },
    { title: 'Profile', icon: <ProfileOutlined />, path: '/home/profile' },
    { title: 'Courses', icon: <BookOutlined />, path: '/home/courses' },
    { title: 'Department', icon: <TeamOutlined />, path: '/home/department' },
    { title: 'Users', icon: <UserOutlined />, path: '/home/users' },
  ],
  faculty: [
    { title: 'Home', icon: <HomeOutlined />, path: '/home' },
    { title: 'Profile', icon: <ProfileOutlined />, path: '/home/profile' },
    { title: 'Courses', icon: <BookOutlined />, path: '/home/courses' },
  ],
  student: [
    { title: 'Home', icon: <HomeOutlined />, path: '/home' },
    { title: 'Profile', icon: <ProfileOutlined />, path: '/home/profile' },
    { title: 'Results', icon: <BookOutlined />, path: '/home/results' },
  ],
};

const SideNavbar = () => {
  const userRole = authStore((state) => state.role);
  const navItems = ROLE_NAV_ITEMS[userRole] || [];
  const jwtToken = useAuthStore((state) => state.jwtToken);

  const handleLogout = () => {};

  return (
    <nav
      style={{
        width: '200px',
        height: '100vh',
        background: '#f0f0f0',
        padding: '20px',
        position: 'fixed',
        overflowY: 'auto',
      }}
    >
      <Menu mode="inline" theme="light" style={{ height: '100%' }}>
        {navItems.map((item, index) => (
          <Menu.Item key={index} icon={item.icon}>
            <Link key={index} href={`${item.path}`}>
              {item.title}
            </Link>
          </Menu.Item>
        ))}
        <Menu.Item
          key="logout"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          <Link
            href="/auth"
            onClick={() => {
              fetch(`${SERVER_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${jwtToken}`,
                },
              });
            }}
          >
            Logout
          </Link>
        </Menu.Item>
      </Menu>
    </nav>
  );
};

export default SideNavbar;
