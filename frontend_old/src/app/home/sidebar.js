'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import {
  UserOutlined,
  HomeOutlined,
  BookOutlined,
  ApartmentOutlined,
  ReadOutlined,
  BarChartOutlined,
  LogoutOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import authStore from '../../store/auth.store';

const SidebarContainer = styled.div`
  background-color: #1e2125;
  color: #ffffff;
  height: 100vh;
  width: 250px;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.4);
`;

const SearchBar = styled.input`
  width: 85%;
  padding: 12px;
  border: none;
  border-radius: 25px;
  outline: none;
  font-size: 16px;
  background-color: #2a2e33;
  margin-bottom: 12px;
  color: #d1d5da;
  &::placeholder {
    color: #d1d5da;
  }
`;

const NavItem = styled.div`
  width: 90%;
  padding: 16px 20px;
  background-color: #2a2e33;
  border-radius: 25px;
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: start;
  margin-bottom: 8px; // Adjusted spacing between items
  margin-top: 8px;

  &:hover {
    background-color: #2e3338;
  }

  svg {
    margin-right: 16px;
    font-size: 28px;
    color: #ffffff;
  }

  span {
    font-size: 18px;
    color: #ffffff;
  }

  &.active {
    background-color: #4e5d94;
  }
`;

const IconStyleWrapper = styled.span`
  margin-right: 16px;
  font-size: 28px;
  display: flex;
  align-items: center;

  svg {
    color: ${({ color }) => color || '#fff'};
  }
`;

const NavItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1; // Added to make the container use available space
`;

const ROLE_NAV_ITEMS = {
  admin: [
    'Profile',
    'Overview',
    'Course List',
    'Department',
    'Courses',
    'Results',
    'Users',
  ],
  faculty: [
    'Profile',
    'Overview',
    'Course List',
    'Courses',
    'Results',
    'Users',
  ],
  student: ['Profile', 'Overview', 'Results'],
};

function SideNavbar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const userRole = authStore((state) => state.role);

  const sanitizeInput = (input) => {
    return input.replace(/[^a-zA-Z ]/g, '');
  };

  const handleSearchChange = (e) => {
    const validatedInput = sanitizeInput(e.target.value);
    setSearchTerm(validatedInput);
  };

  const navItems = [
    {
      path: '/home/profile',
      label: 'Profile',
      icon: <UserOutlined />,
      color: '#e91e63',
    },
    {
      path: '/home',
      label: 'Overview',
      icon: <HomeOutlined />,
      color: '#00bcd4',
    },
    {
      path: '/home/courselist',
      label: 'Course List',
      icon: <BookOutlined />,
      color: '#4caf50',
    },
    {
      path: '/home/department',
      label: 'Department',
      icon: <ApartmentOutlined />,
      color: '#ff9800',
    },
    {
      path: '/home/courses',
      label: 'Courses',
      icon: <ReadOutlined />,
      color: '#673ab7',
    },
    {
      path: '/home/results',
      label: 'Results',
      icon: <BarChartOutlined />,
      color: '#3f51b5',
    },
    {
      path: '/home/users',
      label: 'Users',
      icon: <TeamOutlined />,
      color: '#2196f3',
    },
  ];

  const filteredNavItems =
    userRole && ROLE_NAV_ITEMS[userRole]
      ? navItems.filter((item) => {
          const isRoleAllowed = ROLE_NAV_ITEMS[userRole].includes(item.label);
          const doesLabelMatch = item.label
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          return isRoleAllowed && doesLabelMatch;
        })
      : [];

  return (
    <SidebarContainer>
      <SearchBar
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <NavItemsContainer>
        {filteredNavItems.map((item) => (
          <NavItem
            key={item.path}
            className={router.pathname === item.path ? 'active' : ''}
            onClick={() => router.push(item.path)}
          >
            <IconStyleWrapper color={item.color}>{item.icon}</IconStyleWrapper>
            <span>{item.label}</span>
          </NavItem>
        ))}
      </NavItemsContainer>
      {/* Logout button */}
      <NavItem key="/login" onClick={() => router.push('/login')}>
        <IconStyleWrapper color="#f44336">
          <LogoutOutlined />
        </IconStyleWrapper>
        <span>Logout</span>
      </NavItem>
    </SidebarContainer>
  );
}

export default SideNavbar;
