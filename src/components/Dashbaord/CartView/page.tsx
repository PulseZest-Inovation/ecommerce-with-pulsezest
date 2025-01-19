'use client'
import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Typography, Badge } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CartDrawer from './CartDrawer';
import FavouriteDrawer from './FavouriteDrawer';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import { CustomerType } from '@/types/Customer';

interface Product {
  id: number;
  name: string;
  price: string;
}

export default function CartView() {
  // State for the drawer visibility
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [favDrawerOpen, setFavDrawerOpen] = useState<boolean>(false);

  // State for customer data, with correct typing
  const [customers, setCustomers] = useState<CustomerType[]>([]); // Explicitly typed state

  // Sample data for products in cart and favorites
  const cartProducts: Product[] = [
    { id: 1, name: 'Product 1', price: '₹10' },
    { id: 2, name: 'Product 2', price: '₹20' },
  ];
  const favoriteProducts: Product[] = [
    { id: 1, name: 'Product 3', price: '₹15' },
    { id: 2, name: 'Product 4', price: '₹25' },
  ];

  // Function to toggle the drawers
  const toggleCartDrawer = (): void => setCartDrawerOpen(!cartDrawerOpen);
  const toggleFavDrawer = (): void => setFavDrawerOpen(!favDrawerOpen);

  // Fetch customer data from Firestore
  const fetchCustomer = async () => {
    try {
      const customerData = await getAllDocsFromCollection<CustomerType>('customers');
      setCustomers(customerData); // Set the fetched customers into state
      console.log('Fetched customers:', customerData);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };
  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomer();
  }, []);

  // Current date for the last update
  const currentDate: string = new Date().toLocaleDateString();

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
        scrollbarWidth: 'thin',
      }}
    >
      <Typography variant="h6" gutterBottom textAlign="center">
        Your Customer Updates
      </Typography>
      <List>
        {customers.length === 0 ? (
          <Typography>No customers available.</Typography>
        ) : (
          customers.map((customer) => (
            <ListItem
              key={customer.id}
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
                <Avatar
                  src={customer.profileUrl || 'https://via.placeholder.com/50'} // Fallback if profileUrl is not available
                  alt={customer.fullName}
                  sx={{ width: 50, height: 50 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={customer.fullName || 'Unknown User'} // Fallback if fullName is not available
                secondary={`Phone: ${customer.phoneNumber || 'N/A'} | Last Update on: ${currentDate}`}
                sx={{ flex: 1, marginLeft: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  color="primary"
                  aria-label="Add to favorites"
                  onClick={toggleFavDrawer}
                >
                  <Badge badgeContent={favoriteProducts.length} color="secondary">
                    <FavoriteBorderIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  color="secondary"
                  aria-label="Add to cart"
                  onClick={toggleCartDrawer}
                >
                  <Badge badgeContent={cartProducts.length} color="primary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Box>
            </ListItem>
          ))
        )}
      </List>

      {/* Drawer for Cart */}
      <CartDrawer
        markAsRead={()=>{}}
        cartDrawerOpen={cartDrawerOpen}
        toggleCartDrawer={toggleCartDrawer}
        cartProducts={cartProducts}
      />

      {/* Drawer for FavouriteDrawer */}
      <FavouriteDrawer
        markAsRead={()=>{}}
        favDrawerOpen={favDrawerOpen}
        toggleFavDrawer={toggleFavDrawer}
        favoriteProducts={favoriteProducts}
      />
    </Box>
  );
}
