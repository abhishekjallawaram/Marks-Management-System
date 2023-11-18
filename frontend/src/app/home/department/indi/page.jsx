'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useDepartmentStore from '../../../../../store/departmentStore';
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
} from '@mui/material';

const IndividualPage = () => {
  const [dep, setDep] = useState(null);
  const [depName, setDepName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const selectedDepartment = useDepartmentStore(
    (state) => state.selectedDepartment,
  );
  const jwtToken = useAuthStore((state) => state.jwtToken);
  const history = useRouter(); // Hook for redirecting

  useEffect(() => {
    setLoading(true);
    fetch(`https://localhost:3000/departments/${selectedDepartment}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDep(data);
        setDepName(data.name);
        setError('');
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [jwtToken, selectedDepartment]);

  const handleSave = () => {
    setLoading(true);
    fetch(`https://localhost:3000/departments/${dep.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        name: depName,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setDep({ ...dep, name: depName });
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
    if (window.confirm('Are you sure you want to delete this department?')) {
      setLoading(true);
      fetch(`https://localhost:3000/departments/${dep.id}`, {
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
          history.push('/home/department'); // Redirect to the departments page
        })
        .catch((error) => {
          setError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Box
      sx={{
        margin: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {dep && (
        <Card sx={{ minWidth: 275, margin: 2 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Department Details
            </Typography>
            <form noValidate autoComplete="off">
              <TextField
                label="ID"
                value={dep.id}
                variant="outlined"
                margin="normal"
                fullWidth
                disabled
              />
              <TextField
                label="Name"
                value={depName}
                onChange={(e) => setDepName(e.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth
              />
              <TextField
                label="Created At"
                value={dep.createdAt}
                variant="outlined"
                margin="normal"
                fullWidth
                disabled
              />
              <TextField
                label="Updated At"
                value={dep.updatedAt}
                variant="outlined"
                margin="normal"
                fullWidth
                disabled
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 2,
                }}
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
                  Delete Department
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default IndividualPage;
