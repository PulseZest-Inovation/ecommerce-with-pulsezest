// app/dashboard/page.tsx
'use client';

import React from 'react';
import { Box, Typography } from "@mui/material";

// This page content can be dynamic based on the current route path
const DashboardPage = () => {
  return (
    <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <Typography variant="h4">Welcome to the Dashboard</Typography>
      <Typography variant="body1">Our <strong className='underline cursor-pointer'>PulseZest</strong> Team, is Working on this. We close the Project Very Soon</Typography>
    </Box>
  );
};

export default DashboardPage;
