'use client';

import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Divider, Typography } from '@mui/material';
import useAuthStore from '../../../../store/authStore';

const CreateDepartment = ({ setFetchAgain, setDrawerIsOpen }) => {
  const jwtToken = useAuthStore((state) => state.jwtToken);

  const postData = (formData) => {
    // Data fetching logic here
    fetch('https://localhost:3000/departments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.get('name'),
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
    console.log({
      name: formData.get('name'),
    });
    postData(formData); // Call postData here
  };

  return (
    <div>
      <Typography variant="h6">Create Department</Typography>
      <Divider />
      <form onSubmit={handleSubmit} style={{ marginLeft: '30px' }}>
        <TextField
          name="name"
          label="Name"
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

export default CreateDepartment;
