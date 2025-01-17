import React from 'react';
import { Box, Typography, Divider, List, ListItem, ListItemText, IconButton, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface NotificationBarProps {
  onClose: () => void;
}

const NotificationBar: React.FC<NotificationBarProps> = ({ onClose }) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)'); // Check if it's a desktop screen

  return (
    <Box
      sx={{
        position: 'fixed',
        top: isDesktop ? '10px' : 0, // Add margin from the top for desktop
        right: 0,
        width: isDesktop ? '400px' : '300px', // Wider for desktop
        height: '100%',
        backgroundColor: '#f9f9f9', // Softer background for better UX
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1300, // Higher z-index for visibility
        borderTopLeftRadius: isDesktop ? '8px' : 0, // Rounded corner for desktop
        borderBottomLeftRadius: isDesktop ? '8px' : 0,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto', // Scrollable for long content
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #ddd',
          backgroundColor: '#fff',
          borderTopLeftRadius: isDesktop ? '8px' : 0,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Notifications
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Notification List */}
      <List sx={{ p: 2 }}>
        {[1, 2, 3, 4, 5].map((item) => (
          <React.Fragment key={item}>
            <ListItem sx={{ borderRadius: '8px', ':hover': { backgroundColor: '#f1f1f1' } }} className='cursor-pointer'>
              <ListItemText
                primary={`Notification ${item}`}
                secondary={`This is the details for notification ${item}.`}
              />
            </ListItem>
            {item !== 5 && <Divider sx={{ margin: '8px 0' }} />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default NotificationBar;
