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
  interface CartProduct {
    id: string;
    productName: string;
    price: string; // Convert price to string for display
  }
  


interface CartDrawerProps {
  cartDrawerOpen: boolean;
  toggleCartDrawer: () => void; // Function to toggle the cart drawer
  cartProducts: CartProduct[]; // Cart products data
  markAsRead: (list: string) => void; // Function to mark items as read
}

export default function CartDrawer({
  cartDrawerOpen,
  toggleCartDrawer,
  cartProducts,
  markAsRead,
}: CartDrawerProps) {
  return (
    <Drawer anchor="right" open={cartDrawerOpen} onClose={toggleCartDrawer}>
      <Box sx={{ width: 300, padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Cart Products
        </Typography>
        <Divider />
        <List>
          {cartProducts.length > 0 ? (
            cartProducts.map((product) => (
              <ListItem key={product.id}>
                <ListItemText primary={product.productName} secondary={product.price} />
                <IconButton aria-label="WhatsApp">
                  <WhatsAppIcon />
                </IconButton>
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" sx={{ marginTop: 2 }}>
              No products in the cart.
            </Typography>
          )}
        </List>
        <Button
          onClick={() => {
            markAsRead('cart'); // Calls the markAsRead function
            toggleCartDrawer(); // Closes the drawer
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
