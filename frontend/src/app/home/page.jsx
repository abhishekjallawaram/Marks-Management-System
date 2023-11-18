'use client';

import React from 'react';
import { Grid, CircularProgress, Typography } from '@material-ui/core';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Divider, ListItem, ListItemButton, ListItemText } from '@mui/material';
import dayjs from 'dayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import List from '@mui/material/List';

const Home = () => {
  const studentData = [
    { name: 'ML', Roa: 90, TSG: 85 },
    { name: 'DL', Roa: 80, TSG: 88 },
    { name: 'OS', Roa: 85, TSG: 91 },
  ];

  function ActionList(props) {
    const { className } = props;
    const actions = [];
    return (
      <List className={className}>
        {actions.map(({ text, method }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={method}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  }

  return (
    <div>
      <Typography variant="h5">Dashboard</Typography>
      <Divider />
      <div style={{ marginBottom: '16px' }}></div>
      <Grid container spacing={2} style={{ width: '100%' }}>
        <Grid item xs={12} sm={6}>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <CircularProgress variant="determinate" value={95} size={300} />
              <Typography variant="h6">3.85 GPA</Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <LineChart width={400} height={300} data={studentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Roa" stroke="#8884d8" name="Roa" />
            <Line type="monotone" dataKey="TSG" stroke="#82ca9d" name="TSG" />
          </LineChart>
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              defaultValue={dayjs(new Date())}
              orientation="landscape"
              slots={{
                actionBar: ActionList,
              }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
