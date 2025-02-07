import React, { useMemo } from "react";
import {
  Box,
  Drawer,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemAvatar,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

interface CartProduct {
  id: string;
  productTitle: string;
  price: number;
  slug: string;
  image?: string;
}

interface CustomerType {
  id: string;
  fullName: string;
  phoneNumber: string;
}

interface CartDrawerProps {
  cartDrawerOpen: boolean;
  toggleCartDrawer: () => void;
  selectedCustomer: CustomerType | null;
  cartProducts: CartProduct[];
  website: string;
  phoneNumber: string;
}

const handleWhatsAppClick = (
  fullName: string,
  phone: string,
  website: string
) => {
  const checkoutLink = `${website}/checkout`;

  const message = `Hi ${fullName}, We noticed you left some great items in your cart at https://apnimaativastram.com/. They’re still waiting for you! 🎉

Get a special 10% OFF just for you! Use code FIRST10 at checkout. But hurry—this offer expires soon! ⏳

Complete your purchase here: ${checkoutLink}

Need any help? We’re here for you! 😊

- Shravani
Apni Maati Vastram`;

  // Encode the message correctly
  const encodedMessage = encodeURIComponent(message);

  // Use `wa.me` for better compatibility
  const url = `https://wa.me/${phone}?text=${encodedMessage}`;

  // Open the WhatsApp chat
  window.open(url, "_blank");
};



export default function CartDrawer({
  cartDrawerOpen,
  toggleCartDrawer,
  selectedCustomer,
  cartProducts,
  website,
  phoneNumber,
}: CartDrawerProps) {
  const customerName = useMemo(
    () => selectedCustomer?.fullName || "Guest",
    [selectedCustomer]
  );
  const customerPhone = useMemo(
    () => selectedCustomer?.phoneNumber || phoneNumber || "",
    [selectedCustomer, phoneNumber]
  );

  return (
    <Drawer
      anchor="right"
      open={cartDrawerOpen}
      onClose={toggleCartDrawer}
      aria-label="Shopping cart drawer"
    >
      <Box sx={{ width: 400, padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          {customerName}'s Cart
        </Typography>
        <Divider />
        <List>
          {cartProducts.length > 0 ? (
            cartProducts.map((product) => (
              <ListItem key={product.id}>
                <ListItemAvatar>
                  <Box
                    component="img"
                    src={product.image || "https://via.placeholder.com/50"}
                    alt={product.productTitle}
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "4px",
                      objectFit: "cover",
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={product.productTitle}
                  secondary={`₹${product.price.toLocaleString("en-IN")}`}
                />
                <IconButton
                  aria-label={`Share ${product.productTitle} on WhatsApp`}
                  onClick={() =>
                    handleWhatsAppClick(customerName, customerPhone, website)
                  }
                  disabled={!customerPhone} // Disable if no phone number
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
      </Box>
    </Drawer>
  );
}
