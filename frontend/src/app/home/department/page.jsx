// DepartmentsPage.jsx
'use client';
import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useAuthStore from '../../../../store/authStore';
import { Button, Divider, Drawer, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateDepartment from './department.create';
import { useRouter } from 'next/navigation';
import useDepartmentStore from '../../../../store/departmentStore';
import { SERVER_URL } from '../../../constants';

const DepartmentsPage = () => {
  const router = useRouter();
  const rows = [];
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [departments, setDepartments] = useState([]);
  const setSelectedDepartment = useDepartmentStore(
    (state) => state.setSelectedDepartment,
  );
  const jwtToken = useAuthStore((state) => state.jwtToken);
  const setJWTToken = useAuthStore((state) => state.setJWTToken);

  useEffect(() => {
    fetch(`${SERVER_URL}/departments`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((response) => response.json())
      .then((resp) => {
        if (resp.statusCode === 401) {
          setJWTToken(null);
          router.push('/auth/login');
        }
      })
      .then(setDepartments);
    setFetchAgain(false);
  }, [jwtToken, fetchAgain, router, setJWTToken]);

  function createData(id, name, createdAt, updatedAt) {
    return { id, name, createdAt, updatedAt };
  }

  departments.forEach((dept) => {
    rows.push(
      createData(
        dept['id'],
        dept['name'],
        dept['createdAt'],
        dept['updatedAt'],
      ),
    );
  });

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: '8px',
          marginTop: '8px',
        }}
      >
        <div>
          <Typography variant="h5" style={{ paddingLeft: '8px' }}>
            Department
          </Typography>
        </div>

        <div>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setDrawerIsOpen(true)}
          >
            Create
          </Button>
        </div>
      </div>

      <Divider style={{ marginBottom: '10px' }} />

      <Drawer
        anchor="right"
        open={drawerIsOpen}
        onClose={() => setDrawerIsOpen(false)}
      >
        <div style={{ width: '30vw', margin: '30px' }}>
          <CreateDepartment
            setFetchAgain={setFetchAgain}
            setDrawerIsOpen={setDrawerIsOpen}
          />
        </div>
      </Drawer>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Created&nbsp;At</TableCell>
              <TableCell>Updated&nbsp;At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <div
                key={row}
                onClick={() => {
                  setSelectedDepartment(row.id);
                  router.push('/home/department/indi');
                }}
              >
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.createdAt}</TableCell>
                  <TableCell>{row.updatedAt}</TableCell>
                </TableRow>
              </div>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DepartmentsPage;
