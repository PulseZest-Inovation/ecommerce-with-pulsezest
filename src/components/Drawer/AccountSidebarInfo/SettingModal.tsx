// components/SettingsModal.tsx
import React, { useState } from 'react';
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Typography, DialogTitle, DialogContent, Modal, Tabs, Tab } from "@mui/material";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

function SettingsModal({ open, onClose }: SettingsModalProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<number>(0); // State to track active tab

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        backdropFilter: 'blur(4px)', // Add blur effect
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 900,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
          outline: 'none',
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
       

        {/* Horizontal Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ marginBottom: 2 }}
        >
          <Tab label="Application Info" />
          <Tab label="User Info" />
          <Tab label="Usage Info" />
        </Tabs>

        {/* Tab Content */}
        <DialogContent>
          {activeTab === 0 && (
            <Typography>Details about the application.</Typography>
          )}
          {activeTab === 1 && (
            <Typography>Details about the user.</Typography>
          )}
          {activeTab === 2 && (
            <Typography>Details about usage statistics.</Typography>
          )}
        </DialogContent>
      </Box>
    </Modal>
  );
}

export default SettingsModal;
