'use client';

import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <Box className="mb-8">
      <Typography variant="h6" className="font-semibold mb-4">
        {title}
      </Typography>
      <Grid container spacing={2}>{children}</Grid>
    </Box>
  );
};

export default Section;
