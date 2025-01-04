'use client';

import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  valueClassName?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subtitle, valueClassName }) => {
  return (
    <Card className="shadow-lg">
      <CardContent>
        <Typography variant="body2" className="text-gray-600">
          {title}
        </Typography>
        <Typography variant="h5" className={`font-bold my-2 ${valueClassName || ''}`}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" className="text-gray-500">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
