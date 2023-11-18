'use client';
import React, { useState, useEffect } from 'react';
import useAuthStore from '../../../../../../store/authStore';
import useCourseStore from '../../../../../../store/courseStore';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';

const IndividualCoursePage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const jwtToken = useAuthStore((state) => state.jwtToken);
  const student = useCourseStore((state) => state.selectedStudent);
  const userRole = useAuthStore((state) => state.role); // Get user role

  useEffect(() => {
    setLoading(true);
    fetch(`https://localhost:3000/assignments/${student.id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        courseEnrollmentId: student.enrollmentId,
      }),
      method: 'PUT',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAssignments(data);
        setError('');
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [jwtToken, student.enrollmentId, student.id]);

  const handleUpdateMarks = (id, marks) => {
    setLoading(true);
    fetch(`https://localhost:3000/assignments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        courseEnrollmentId: student.enrollmentId,
        marks: parseInt(marks, 10),
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setAssignments(
          assignments.map((assignment) =>
            assignment.id === id ? { ...assignment, marks: marks } : assignment,
          ),
        );
        setError('');
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={3} justifyContent="center">
        {assignments.map((assignment) => (
          <Grid item xs={12} md={6} lg={4} margin={10} key={assignment.id}>
            <Card raised sx={{ minWidth: 300, maxWidth: 400 }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {assignment.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Max Grade: {assignment.maxGrade}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Weightage: {assignment.weightage}%
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Deadline: {new Date(assignment.deadline).toLocaleString()}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Penalty: {new Date(assignment.penalty).toLocaleString()}
                </Typography>
                {userRole === 'faculty' ? ( // Only allow editing for 'faculty' role
                  <>
                    <TextField
                      label="Marks"
                      type="number"
                      value={assignment.marks || ''}
                      onChange={(e) =>
                        setAssignments(
                          assignments.map((assn) =>
                            assn.id === assignment.id
                              ? { ...assn, marks: e.target.value }
                              : assn,
                          ),
                        )
                      }
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      sx={{ marginBottom: 2 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() =>
                        handleUpdateMarks(assignment.id, assignment.marks)
                      }
                      disabled={loading}
                    >
                      Update Marks
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography color="textSecondary" gutterBottom>
                      Marks: {assignment.marks || 'N/A'}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default IndividualCoursePage;
