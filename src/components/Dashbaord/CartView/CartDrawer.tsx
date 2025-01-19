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
  ListItemAvatar,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

interface CartProduct {
  id: string;
  productName: string;
  price: string;
  slug: string;
  website?: string;
  productImage: string;
}

interface CartDrawerProps {
  cartDrawerOpen: boolean;
  toggleCartDrawer: () => void;
  cartProducts: CartProduct[];
  markAsRead: (list: string) => void;
  phoneNumber: string;
  website: string;
}

export default function CartDrawer({
  cartDrawerOpen,
  toggleCartDrawer,
  cartProducts,
  markAsRead,
  phoneNumber,
  website
}: CartDrawerProps) {
  // Function to navigate to WhatsApp with a pre-written message
  const handleWhatsAppClick = (
    productName: string,
    productSlug: string,
  ) => {
    const productUrl = `${website}/${productSlug}`; // Corrected URL formatting
    const message = `${productUrl} Are you interested in ${productName}?`; // Fixed grammar
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank'); // Open the WhatsApp link in a new tab
  };
  

  return (
    <Drawer anchor="right" open={cartDrawerOpen} onClose={toggleCartDrawer}>
      <Box sx={{ width: 400, padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Cart Products
        </Typography>
        <Divider />
        <List>
  {cartProducts.length > 0 ? (
    cartProducts.map((product) => (
      <ListItem key={product.id}>
        <ListItemAvatar>
          <Box
            component="img"
            src={product.productImage}
            alt={product.productName}
            sx={{
              width: 50,
              height: 50,
              borderRadius: '4px',
              objectFit: 'cover',
            }}
          />
        </ListItemAvatar>
        <ListItemText primary={product.productName} secondary={`₹${product.price}`} />
        <IconButton
          aria-label="WhatsApp"
          onClick={() => handleWhatsAppClick(product.productName, product.slug)} // Navigate to WhatsApp
        >
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

        {/* <Button
          onClick={() => {
            markAsRead('cart');
            toggleCartDrawer();
          }}
          sx={{ marginTop: 2 }}
          fullWidth
          variant="outlined"
        >
          Mark as Read & Close
        </Button> */}
      </Box>
    </Drawer>
  );
}
