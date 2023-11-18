'use client';

import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Divider, Typography } from '@mui/material';
import useAuthStore from '../../../../store/authStore';

const CreateCourse = ({ setFetchAgain, setDrawerIsOpen }) => {
  const jwtToken = useAuthStore((state) => state.jwtToken);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  const postData = (formData) => {
    fetch('https://localhost:3000/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        name: formData.get('name'),
        level: formData.get('level'),
        type: formData.get('type'),
        credits: parseInt(formData.get('credits'), 10),
        startDate: formatDateTime(formData.get('startDate')),
        endDate: formatDateTime(formData.get('endDate')),
        term: formData.get('term'),
        section: formData.get('section'),
        maxStrength: parseInt(formData.get('maxStrength'), 10),
        instructorId: parseInt(formData.get('instructorId'), 10),
        departmentId: parseInt(formData.get('departmentId'), 10),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(JSON.stringify(data));
        setFetchAgain(true);
        setDrawerIsOpen(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setFetchAgain(true);
        setDrawerIsOpen(false);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    postData(formData);
  };

  return (
    <div>
      <Typography variant="h6">Create Course</Typography>
      <Divider />
      <form onSubmit={handleSubmit} style={{ marginLeft: '30px' }}>
        <TextField
          name="name"
          label="Course Name"
          variant="outlined"
          margin="normal"
          required
        />
        <TextField
          name="level"
          label="Level"
          variant="outlined"
          margin="normal"
          required
        />
        <TextField
          name="type"
          label="Type"
          variant="outlined"
          margin="normal"
          required
        />
        <TextField
          name="credits"
          label="Credits"
          type="number"
          variant="outlined"
          margin="normal"
          required
        />
        <TextField
          name="startDate"
          label="Start Date"
          type="datetime-local"
          variant="outlined"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          name="endDate"
          label="End Date"
          type="datetime-local"
          variant="outlined"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          name="term"
          label="Term"
          variant="outlined"
          margin="normal"
          required
        />
        <TextField
          name="section"
          label="Section"
          variant="outlined"
          margin="normal"
          required
        />
        <TextField
          name="maxStrength"
          label="Maximum Strength"
          type="number"
          variant="outlined"
          margin="normal"
          required
        />
        <TextField
          name="instructorId"
          label="Instructor ID"
          type="number"
          variant="outlined"
          margin="normal"
          required
        />
        <TextField
          name="departmentId"
          label="Department ID"
          type="number"
          variant="outlined"
          margin="normal"
          required
        />
        <div>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
