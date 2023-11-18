'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../../../../store/authStore';
import {
  Card,
  CardContent,
  TextField,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from '@mui/material';
import useCourseStore from '../../../../../store/courseStore';

const IndividualCoursePage = () => {
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [courseDetails, setCourseDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const selectedCourse = useCourseStore((state) => state.selectedCoures);
  const jwtToken = useAuthStore((state) => state.jwtToken);
  const router = useRouter();
  const setSelectedStudent = useCourseStore(
    (state) => state.setSelectedStudent,
  );
  const userRole = useAuthStore((state) => state.role);

  useEffect(() => {
    setLoading(true);
    console.log('####', selectedCourse);
    fetch(`https://localhost:3000/courses/${selectedCourse}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCourse(data.courseDetails);
        setStudents(data.students);
        setCourseDetails({
          ...data.courseDetails,
        });
        setError('');
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [jwtToken, selectedCourse]);

  const handleSave = () => {
    setLoading(true);
    fetch(`https://localhost:3000/courses/${course.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(courseDetails),
    })
      .then((response) => response.json())
      .then(() => {
        setCourse({ ...course, ...courseDetails });
        setError('');
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setLoading(true);
      fetch(`https://localhost:3000/courses/${course.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(() => {
          router.push('/home/courses');
        })
        .catch((error) => {
          setError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleChange = (e, name) => {
    setCourseDetails({
      ...courseDetails,
      [name]:
        name === 'credits' ||
        name === 'instructorId' ||
        name === 'maxStrength' ||
        name === 'departmentId'
          ? parseInt(e.target.value, 10)
          : e.target.value,
    });
  };

  const handleCreateAssignment = () => {
    router.push('/home/courses/indi/create');
  };

  return (
    <Box sx={{ margin: 2 }}>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {course && (
        <Card sx={{ minWidth: 275, maxWidth: 800, margin: 'auto' }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Course Details
            </Typography>
            <form noValidate autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="ID"
                    value={course.id}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  {/* Empty grid item for alignment */}
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Name"
                    value={courseDetails.name}
                    onChange={(e) => handleChange(e, 'name')}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Type"
                    value={courseDetails.type}
                    onChange={(e) => handleChange(e, 'type')}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Credits"
                    value={courseDetails.credits}
                    onChange={(e) => handleChange(e, 'credits')}
                    type="number"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Level"
                    value={courseDetails.level}
                    onChange={(e) => handleChange(e, 'level')}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Term"
                    value={courseDetails.term}
                    onChange={(e) => handleChange(e, 'term')}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Section"
                    value={courseDetails.section}
                    onChange={(e) => handleChange(e, 'section')}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Instructor ID"
                    type="number"
                    value={courseDetails.instructorId}
                    onChange={(e) => handleChange(e, 'instructorId')}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Max Strength"
                    type="number"
                    value={courseDetails.maxStrength}
                    onChange={(e) => handleChange(e, 'maxStrength')}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Department ID"
                    type="number"
                    value={courseDetails.departmentId}
                    onChange={(e) => handleChange(e, 'departmentId')}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  Save Changes
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete Course
                </Button>

                {userRole === 'faculty' && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateAssignment}
                  >
                    Create Assignment
                  </Button>
                )}
              </Box>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Student Details Table */}
      <TableContainer component={Paper} sx={{ minWidth: 650, marginTop: 3 }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>College ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <div
                style={{ cursor: 'pointer' }}
                key={student}
                onClick={() => {
                  setSelectedStudent(student);
                  router.push('/home/courses/indi/stu');
                }}
              >
                <TableRow key={student.enrollmentId}>
                  <TableCell>{student.collegeId}</TableCell>
                  <TableCell>{student.firstName}</TableCell>
                  <TableCell>{student.lastName}</TableCell>
                </TableRow>
              </div>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default IndividualCoursePage;
