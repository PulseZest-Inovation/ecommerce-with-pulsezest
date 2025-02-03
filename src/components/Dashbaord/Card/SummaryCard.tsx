'use client';

import React from 'react';
import { Card, CardContent, Typography, Tooltip } from '@mui/material';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  valueClassName?: string;
  icon?: React.ReactNode;
  tooltip?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subtitle, valueClassName, icon, tooltip }) => {
  return (
    <Card className="shadow-md rounded-lg transition-transform transform hover:scale-105">
      <CardContent className="flex flex-col items-start">
        <div className="flex items-center gap-2">
          {icon && <span className="text-xl text-gray-500">{icon}</span>}
          <Tooltip title={tooltip || ''} arrow>
            <Typography variant="body2" className="text-gray-600 cursor-help">
              {title}
            </Typography>
          </Tooltip>
        </div>

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
