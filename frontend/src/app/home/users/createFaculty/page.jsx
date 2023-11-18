'use client';
import React, { useState } from 'react';
import { Typography, TextField, Button, Paper, Divider } from '@mui/material';
import useAuthStore from '../../../../../store/authStore';

const CreateFacultyPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    gender: '',
    academicDetails: '',
    employmentType: '',
    domain: '',
    departmentId: 0,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const jwtToken = useAuthStore((state) => state.jwtToken);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    setLoading(true);
    setError('');

    fetch('https://localhost:3000/auth/register/faculty', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        setLoading(false);
        setError('');
        console.log('Faculty created successfully');
      })
      .catch((error) => {
        setLoading(false);
        setError('Error creating faculty: ' + error.message);
      });
  };

  return (
    <div>
      <Typography variant="h4">Create Faculty</Typography>
      <Divider />
      <Paper elevation={3} style={{ padding: '20px' }}>
        <form>
          <TextField
            name="email"
            label="Email"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            name="firstName"
            label="First Name"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            name="middleName"
            label="Middle Name"
            variant="outlined"
            margin="normal"
            fullWidth
            value={formData.middleName}
            onChange={handleChange}
          />
          <TextField
            name="lastName"
            label="Last Name"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={formData.lastName}
            onChange={handleChange}
          />
          <TextField
            name="phoneNumber"
            label="Phone Number"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <TextField
            name="gender"
            label="Gender"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={formData.gender}
            onChange={handleChange}
          />
          <TextField
            name="academicDetails"
            label="Academic Details"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={formData.academicDetails}
            onChange={handleChange}
          />
          <TextField
            name="employmentType"
            label="Employment Type"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={formData.employmentType}
            onChange={handleChange}
          />
          <TextField
            name="domain"
            label="Domain"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={formData.domain}
            onChange={handleChange}
          />
          <TextField
            name="departmentId"
            label="Department ID"
            type="number"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={formData.departmentId}
            onChange={handleChange}
          />
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            Create Faculty
          </Button>
        </form>
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
      </Paper>
    </div>
  );
};

export default CreateFacultyPage;
