'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Divider,
} from '@mui/material';
import useAuthStore from '../../../../store/authStore';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const jwtToken = useAuthStore((state) => state.jwtToken);
  useEffect(() => {
    fetch('https://localhost:3000/auth', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, [jwtToken]);

  const handleCreateStudent = () => {
    router.push('/home/users/createStudent');
  };

  const handleCreateFaculty = () => {
    router.push('/home/users/createFaculty');
  };

  return (
    <div>
      <Typography variant="h4">User List</Typography>
      <Divider />
      <Button variant="contained" color="primary" onClick={handleCreateFaculty}>
        Create Faculty
      </Button>
      <Button variant="contained" color="primary" onClick={handleCreateStudent}>
        Create Student
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              {/* Add more table headers if needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                {/* Add more table cells if needed */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserListPage;
