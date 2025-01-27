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
}

interface NotificationBarProps {
  onClose: () => void;
}

const NotificationBar: React.FC<NotificationBarProps> = ({ onClose }) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await getAllDocsFromCollection<Notification>('notifications');
      setNotifications(data);
    };
    fetchNotifications();
  }, []);

  // Handle delete notification
  const handleDelete = async (id: string) => {
    const success = await deleteDocFromCollection('notifications', id);
    if (success) {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
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
        {notifications.map(({ id, title, message }) => (
          <React.Fragment key={id}>
            <ListItem
              sx={{
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                ':hover': { backgroundColor: '#f1f1f1' },
              }}
              className="cursor-pointer"
            >
              <ListItemText primary={title} secondary={message} />
              <IconButton
                color="success"
                onClick={() => handleDelete(id)}
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
