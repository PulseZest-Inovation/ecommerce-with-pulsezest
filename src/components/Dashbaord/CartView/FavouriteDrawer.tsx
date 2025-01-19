import React from 'react';
import {
  Box,
  Drawer,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

interface FavouriteDrawerProps {
  favDrawerOpen: boolean;
  toggleFavDrawer: () => void; // Updated to be a function type
  favoriteProducts: { id: number; name: string; price: string }[]; // Added this prop for products
  markAsRead: (list: string) => void; // Added this prop for marking as read
}

export default function FavouriteDrawer({
  favDrawerOpen,
  toggleFavDrawer,
  favoriteProducts,
  markAsRead,
}: FavouriteDrawerProps) {
  return (
    <Drawer anchor="right" open={favDrawerOpen} onClose={toggleFavDrawer}>
      <Box sx={{ width: 300, padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Favorite Products
        </Typography>
        <Divider />
        <List>
          {favoriteProducts.length > 0 ? (
            favoriteProducts.map((product) => (
              <ListItem key={product.id}>
                <ListItemText primary={product.name} secondary={product.price} />
                <IconButton aria-label="WhatsApp">
                  <WhatsAppIcon />
                </IconButton>
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              No favorite products available.
            </Typography>
          )}
        </List>
        <Button
          onClick={() => {
            markAsRead('fav'); // Calls the markAsRead function
            toggleFavDrawer(); // Closes the drawer
          }}
          sx={{ marginTop: 2 }}
          fullWidth
          variant="outlined"
        >
          Mark as Read & Close
        </Button>
      </Box>
    </Drawer>
  );
}
