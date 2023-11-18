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
import { Divider } from '@mui/material';
import useCourseStore from '../../../../store/courseStore';

const ResultPage = () => {
  const jwtToken = useAuthStore((state) => state.jwtToken);
  const setSelectedCourse = useCourseStore((state) => state.setSelectedCourse);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('https://localhost:3000/courses/student', {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((response) => response.json())
      .then(setCourses)
      .catch((error) => console.error('Error fetching courses:', error));
  }, [jwtToken]);

  const rows = courses.map((course) => ({
    enrollmentId: course.enrollmentId,
    courseName: course.courseName,
  }));

  return (
    <div>
      <Divider style={{ marginBottom: '10px' }} />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.enrollmentId}
                onClick={() => {
                  setSelectedCourse(row.enrollmentId);
                  router.push('/home/results/indi');
                }}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>{row.enrollmentId}</TableCell>
                <TableCell>{row.courseName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ResultPage;
