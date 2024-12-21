// app/dashboard/page.tsx
'use client';

import React from 'react';
import { Box, Typography } from "@mui/material";

// This page content can be dynamic based on the current route path
const DashboardPage = () => {
  return (
    <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <Typography variant="h4">Welcome to the Dashboard</Typography>
      <Typography variant="body1">Here is the dashboard content. It will dynamically change based on the route.</Typography>
    </Box>
  );
};

export default DashboardPage;
