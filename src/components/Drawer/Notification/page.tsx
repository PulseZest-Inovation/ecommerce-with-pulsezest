import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import { deleteDocFromCollection } from '@/services/FirestoreData/deleteFirestoreData';

interface Notification {
  id: string;
  title: string;
  message: string;
  url?: string;
}

interface NotificationBarProps {
  onClose: () => void;
}

const NotificationBar: React.FC<NotificationBarProps> = ({ onClose }) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getAllDocsFromCollection<Notification>('notifications');
        setNotifications(data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Handle delete notification
  const handleDelete = async (id: string) => {
    try {
      const success = await deleteDocFromCollection('notifications', id);
      if (success) {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      alert('Failed to delete the notification. Please try again.');
    }
  };

  // Handle notification click
  const handleNotificationClick = (url?: string) => {
    if (url) {
      window.location.href = url; // Navigate to the URL using window.location
    }
  };
  

  return (
    <Box
      sx={{
        position: 'fixed',
        top: isDesktop ? '10px' : 0,
        right: 0,
        width: isDesktop ? '400px' : '300px',
        height: '100%',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1300,
        borderTopLeftRadius: isDesktop ? '8px' : 0,
        borderBottomLeftRadius: isDesktop ? '8px' : 0,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
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
        {loading && <Typography>Loading notifications...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && notifications.length === 0 && !error && (
          <Typography>No notifications to display.</Typography>
        )}

        {notifications.map(({ id, title, message, url }) => (
          <React.Fragment key={id}>
            <ListItem
              sx={{
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                ':hover': { backgroundColor: '#f1f1f1', cursor: 'pointer' },
              }}
              onClick={() => handleNotificationClick(url)} // Handle click for navigation
            >
              <ListItemText primary={title} secondary={message} />
              <IconButton
                color="success"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click propagation to the ListItem
                  handleDelete(id);
                }}
                title="Mark as Completed"
              >
                <CheckCircleIcon />
              </IconButton>
            </ListItem>
            <Divider sx={{ margin: '8px 0' }} />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default NotificationBar;
