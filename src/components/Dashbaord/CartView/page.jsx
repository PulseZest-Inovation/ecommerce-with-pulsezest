import React, { useState } from 'react';
import { Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Typography, Badge, Drawer, Divider, Button } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function CartView() {
  // Sample data for users
  const users = [
    { id: 1, image: 'https://via.placeholder.com/50', userNumber: 'Rishab', isRead: false },
    { id: 2, image: 'https://via.placeholder.com/50', userNumber: 'Abhinav', isRead: false },
    { id: 3, image: 'https://via.placeholder.com/50', userNumber: 'Divya Mam', isRead: false },
    { id: 4, image: 'https://via.placeholder.com/50', userNumber: 'Dvivyansh', isRead: false },
    { id: 5, image: 'https://via.placeholder.com/50', userNumber: 'Piyush', isRead: false },
    { id: 6, image: 'https://via.placeholder.com/50', userNumber: 'Shruti', isRead: false },
  ];

  // Sample data for products in cart and favorites
  const cartProducts = [
    { id: 1, name: 'Product 1', price: '₹10' },
    { id: 2, name: 'Product 2', price: '₹20' },
  ];
  const favoriteProducts = [
    { id: 1, name: 'Product 3', price: '₹15' },
    { id: 2, name: 'Product 4', price: '₹25' },
  ];

  // State for the drawer visibility and which list to show
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [favDrawerOpen, setFavDrawerOpen] = useState(false);

  // Function to toggle the drawers
  const toggleCartDrawer = () => setCartDrawerOpen(!cartDrawerOpen);
  const toggleFavDrawer = () => setFavDrawerOpen(!favDrawerOpen);

  // Mark the products as read (cart or favorites)
  const markAsRead = (list) => {
    // Logic to mark as read can be added if needed
  };

  // Current date for the last update
  const currentDate = new Date().toLocaleDateString();

  return (
    <Box
      sx={{
        height: '500px',
        width: '400px',
        padding: 2,
        backgroundColor: '#67cf8a',
        overflowY: 'auto',
        borderRadius: '10px',
        scrollbarColor: 'revert-layer',
        scrollbarWidth:'thin',
      }}
    >
      <Typography variant="h6" gutterBottom textAlign="center">
        Your Customer Updates
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem
            key={user.id}
            sx={{
              backgroundColor: '#fff',
              borderRadius: 2,
              marginBottom: 2,
              boxShadow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <ListItemAvatar>
              <Avatar src={user.image} alt={user.userNumber} sx={{ width: 50, height: 50 }} />
            </ListItemAvatar>
            <ListItemText
              primary={user.userNumber}
              secondary={`Last Update on: ${currentDate}`}
              sx={{ flex: 1, marginLeft: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                color="primary"
                aria-label="Add to favorites"
                onClick={toggleFavDrawer}
              >
                <Badge
                  badgeContent={favoriteProducts.length}
                  color="secondary"
                >
                  <FavoriteBorderIcon />
                </Badge>
              </IconButton>
              <IconButton
                color="secondary"
                aria-label="Add to cart"
                onClick={toggleCartDrawer}
              >
                <Badge
                  badgeContent={cartProducts.length}
                  color="primary"
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Drawer for Cart */}
      <Drawer anchor="right" open={cartDrawerOpen} onClose={toggleCartDrawer}>
        <Box sx={{ width: 300, padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Cart Products
          </Typography>
          <Divider />
          <List>
            {cartProducts.map((product) => (
              <ListItem key={product.id}>
                <ListItemText primary={product.name} secondary={product.price} />
                <IconButton aria-label="WhatsApp">
                  <WhatsAppIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Button
            onClick={() => {
              markAsRead('cart');
              toggleCartDrawer();
            }}
            sx={{ marginTop: 2 }}
            fullWidth
            variant="outlined"
          >
            Mark as Read & Close
          </Button>
        </Box>
      </Drawer>

      {/* Drawer for Favorites */}
      <Drawer anchor="right" open={favDrawerOpen} onClose={toggleFavDrawer}>
        <Box sx={{ width: 300, padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Favorite Products
          </Typography>
          <Divider />
          <List>
            {favoriteProducts.map((product) => (
              <ListItem key={product.id}>
                <ListItemText primary={product.name} secondary={product.price} />
                <IconButton aria-label="WhatsApp">
                  <WhatsAppIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Button
            onClick={() => {
              markAsRead('fav');
              toggleFavDrawer();
            }}
            sx={{ marginTop: 2 }}
            fullWidth
            variant="outlined"
          >
            Mark as Read & Close
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
