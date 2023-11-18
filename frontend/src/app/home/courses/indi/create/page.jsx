'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../../../../../store/authStore';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
} from '@mui/material';

const CreateAssignmentPage = () => {
  const [assignmentData, setAssignmentData] = useState({
    name: '',
    category: '',
    maxGrade: '',
    weightage: '',
    deadline: '',
    penalty: '',
    courseId: 0, // Initialize with the appropriate course ID
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const jwtToken = useAuthStore((state) => state.jwtToken);
  const router = useRouter();

  const handleSubmit = () => {
    setLoading(true);
    fetch('https://localhost:3000/assignments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(assignmentData),
    })
      .then((response) => response.json())
      .then(() => {
        setError('');
        router.push(`/home/courses/indi`);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e, name) => {
    setAssignmentData({
      ...assignmentData,
      [name]: e.target.value,
    });
  };

  return (
    <Box sx={{ margin: 2 }}>
      <Card sx={{ minWidth: 275, maxWidth: 800, margin: 'auto' }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Create Assignment
          </Typography>
          <form noValidate autoComplete="off">
            <TextField
              label="Name"
              value={assignmentData.name}
              onChange={(e) => handleChange(e, 'name')}
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />
            <TextField
              label="Category"
              value={assignmentData.category}
              onChange={(e) => handleChange(e, 'category')}
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />
            <TextField
              label="Max Grade"
              type="number"
              value={assignmentData.maxGrade}
              onChange={(e) => handleChange(e, 'maxGrade')}
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />
            <TextField
              label="Weightage"
              type="number"
              value={assignmentData.weightage}
              onChange={(e) => handleChange(e, 'weightage')}
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />
            <TextField
              label="Deadline"
              type="datetime-local"
              value={assignmentData.deadline}
              onChange={(e) => handleChange(e, 'deadline')}
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="Penalty"
              type="datetime-local"
              value={assignmentData.penalty}
              onChange={(e) => handleChange(e, 'penalty')}
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            {/* courseId should be set to the appropriate course ID */}
            <TextField
              label="Course ID"
              type="number"
              value={assignmentData.courseId}
              onChange={(e) => handleChange(e, 'courseId')}
              variant="outlined"
              margin="normal"
              fullWidth
              required
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                Create Assignment
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateAssignmentPage;
