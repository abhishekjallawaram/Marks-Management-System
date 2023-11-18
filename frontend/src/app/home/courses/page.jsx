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
import CreateCourse from './course.create';
import { useRouter } from 'next/navigation';
import useCourseStore from '../../../../store/courseStore';

const CreatePage = () => {
  const router = useRouter();
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [courses, setCourses] = useState([]);
  const setSelectedCourse = useCourseStore((state) => state.setSelectedCourse);
  const jwtToken = useAuthStore((state) => state.jwtToken);
  const userRole = useAuthStore((state) => state.role);

  useEffect(() => {
    fetch('https://localhost:3000/courses', {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((response) => response.json())
      .then(setCourses)
      .catch((error) => console.error('Error fetching courses:', error));
    setFetchAgain(false);
  }, [jwtToken, fetchAgain]);

  const rows = courses.map((course) => ({
    id: course.id,
    name: course.name,
    type: course.type,
    credits: course.credits,
    level: course.level,
  }));

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
        <Typography variant="h5" style={{ paddingLeft: '8px' }}>
          Courses
        </Typography>

        {userRole === 'admin' && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setDrawerIsOpen(true)}
          >
            Create
          </Button>
        )}
      </div>

      <Divider style={{ marginBottom: '10px' }} />

      <Drawer
        anchor="right"
        open={drawerIsOpen}
        onClose={() => setDrawerIsOpen(false)}
      >
        <div style={{ width: '30vw', margin: '30px' }}>
          <CreateCourse
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
              <TableCell>Type</TableCell>
              <TableCell>Credits</TableCell>
              <TableCell>Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => {
                  setSelectedCourse(row.id);
                  router.push('/home/courses/indi');
                }}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.credits}</TableCell>
                <TableCell>{row.level}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CreatePage;
