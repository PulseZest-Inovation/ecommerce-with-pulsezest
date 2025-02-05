'use client';
import React, { useEffect, useState, MouseEvent } from 'react';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popover from '@mui/material/Popover';
import {
  Box,
  Avatar,
  Typography,
  MenuList,
  MenuItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { getUser } from '@/services/getUser';
import { useRouter } from 'next/navigation';
import { auth } from '@/config/firbeaseConfig';
import { signOut } from 'firebase/auth';
import SettingsModal from './SettingModal';

interface User {
  fullName: string;
  email: string;
  profileUrl: string;
}

function AccountSidebarInfo(): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false); // State to handle settings modal visibility
  const [logoutModalOpen, setLogoutModalOpen] = useState<boolean>(false); // State to handle logout confirmation modal

  const router = useRouter();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser({
          fullName: userData.fullName,
          email: userData.email,
          profileUrl: userData.profileUrl,
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleClick = (event: MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut(auth); // Firebase sign-out logic
      router.push('/login');
    } catch (error) {
      console.error('Error during sign-out:', error);
    } finally {
      setLogoutModalOpen(false); // Close the logout modal after sign-out
    }
  };

  const open = Boolean(anchorEl);

  const handleSettingsModalOpen = () => setSettingsModalOpen(true); // Open settings modal
  const handleSettingsModalClose = () => setSettingsModalOpen(false); // Close settings modal
  const handleLogoutModalOpen = () => setLogoutModalOpen(true); // Open logout confirmation modal
  const handleLogoutModalClose = () => setLogoutModalOpen(false); // Close logout confirmation modal

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography>No user information available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          sx={{ width: 40, height: 40, marginRight: 1 }}
          src={user.profileUrl}
          alt={user.fullName}
          onClick={handleClick}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="body1">{user.fullName}</Typography>
          <Typography variant="body2" color="textSecondary">
            {user.email}
          </Typography>
        </Box>

        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuList>
          <MenuItem onClick={handleSettingsModalOpen}>
            <ListItemText primary="Settings" />
          </MenuItem>
          <MenuItem onClick={handleLogoutModalOpen}>
            <ListItemText primary="Sign Out" />
          </MenuItem>
        </MenuList>
      </Popover>

      {/* Call the SettingsModal component */}
      <SettingsModal open={settingsModalOpen} onClose={handleSettingsModalClose} />

      {/* Logout Confirmation Modal */}
      <Dialog open={logoutModalOpen} onClose={handleLogoutModalClose}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to log out?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="secondary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AccountSidebarInfo;
