import React, { useState } from 'react';
import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Typography, DialogContent, Modal, Tabs, Tab } from "@mui/material";
import { Button, Result } from 'antd';

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
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 700 }, // Make modal responsive
          maxHeight: '80vh', // Set max height for the modal
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          outline: 'none',
          overflow: 'hidden', // Prevent content from overflowing outside the modal box
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
        <DialogContent
          sx={{
            maxHeight: 'calc(80vh - 80px)', // Calculate content area height
            overflowY: 'auto', // Enable scroll if needed
            '&::-webkit-scrollbar': {
              display: 'none', // Hide scrollbar
            },
            msOverflowStyle: 'none', // For Internet Explorer
            scrollbarWidth: 'none', // For Firefox
          }}
        >
          {activeTab === 0 && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Application Information
              </Typography>
              <Result
                status="500"
                title="PulseZest is working"
                subTitle="This Feature is Available very soon."
                extra={<Button type="primary" onClick={onClose}>Back Home</Button>}
              />
            </Box>
          )}
          {activeTab === 1 && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                User Information
              </Typography>
              <Result
                status="500"
                title="PulseZest is working"
                subTitle="This Feature is Available very soon."
                extra={<Button type="primary" onClick={onClose}>Back Home</Button>}
              />
            </Box>
          )}
          {activeTab === 2 && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Usage Statistics
              </Typography>
              <Result
                status="500"
                title="PulseZest is working"
                subTitle="This Feature is Available very soon."
                extra={<Button type="primary" onClick={onClose}>Back Home</Button>}
              />
            </Box>
          )}
        </DialogContent>
      </Box>
    </Modal>
  );
}

export default SettingsModal;
