'use client';

import React from 'react';
import { Card, CardContent, Typography, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

interface ConfirmedOrderCardProps {
  title: string;
  value: string | number;
}

const ConfirmedOrderCard: React.FC<ConfirmedOrderCardProps> = ({ title, value }) => {
  return (
    <Card className="shadow-lg">
      <CardContent>
        <Typography variant="body2" className="text-gray-600 flex items-center">
          {title}
          <Tooltip title="Last Updated at 11:24 PM, Today">
            <IconButton size="small" className="ml-1">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        <Typography variant="h5" className="font-bold my-2">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ConfirmedOrderCard;
