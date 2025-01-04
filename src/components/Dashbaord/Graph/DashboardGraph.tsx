'use client';

import React from 'react';
import { Box, Typography, Grid, MenuItem, Select, Paper } from '@mui/material';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Sample Data
const data = [
  { date: '28-Dec', totalOrders: 0.4, confirmedItems: 0.3 },
  { date: '29-Dec', totalOrders: 0.6, confirmedItems: 0.5 },
  { date: '30-Dec', totalOrders: 0.8, confirmedItems: 0.7 },
  { date: '31-Dec', totalOrders: 0.9, confirmedItems: 0.8 },
  { date: '01-Jan', totalOrders: 0.7, confirmedItems: 0.6 },
  { date: '02-Jan', totalOrders: 0.5, confirmedItems: 0.4 },
  { date: '03-Jan', totalOrders: 0.3, confirmedItems: 0.2 },
];

const DashboardGraphs = () => {
  return (
    <Box sx={{ padding: 4, backgroundColor: '#f9f9f9' }}>
      {/* Title */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
        Order Trends
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 4 }}>
        Based on Order Created Date
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginBottom: 4 }}>
        <Select defaultValue="Last Week" size="small">
          <MenuItem value="Last Week">Last Week</MenuItem>
          <MenuItem value="Last Month">Last Month</MenuItem>
        </Select>
        <Select defaultValue="Day" size="small">
          <MenuItem value="Day">Day</MenuItem>
          <MenuItem value="Week">Week</MenuItem>
        </Select>
      </Box>

      {/* Graphs */}
      <Grid container spacing={3}>
        {/* Order vs Date */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', marginBottom: 2 }}>
              Order vs Date
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid stroke="#e0e0e0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalOrders" stroke="#3f51b5" name="Total Orders" />
                <Line type="monotone" dataKey="confirmedItems" stroke="#4caf50" name="Confirmed Order Items" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Revenue vs Date */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', marginBottom: 2 }}>
              Revenue vs Date
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid stroke="#e0e0e0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalOrders" stroke="#3f51b5" name="Total Orders" />
                <Line type="monotone" dataKey="confirmedItems" stroke="#4caf50" name="Confirmed Order Items" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardGraphs;
