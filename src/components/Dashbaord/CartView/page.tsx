import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Typography, Badge } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CartDrawer from './CartDrawer';
import FavouriteDrawer from './FavouriteDrawer';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import { CustomerType } from '@/types/Customer';
import { CartType } from '@/types/CartType'; // Assuming you have a CartType

interface Product {
  id: number;
  name: string;
  price: string;
}

export default function CartView() {
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [favDrawerOpen, setFavDrawerOpen] = useState<boolean>(false);
  const [customers, setCustomers] = useState<CustomerType[]>([]); 

  const favoriteProducts: Product[] = [
    { id: 1, name: 'Product 3', price: '₹15' },
    { id: 2, name: 'Product 4', price: '₹25' },
  ];

  // Function to toggle the drawers
  const toggleCartDrawer = (): void => setCartDrawerOpen(!cartDrawerOpen);
  const toggleFavDrawer = (): void => setFavDrawerOpen(!favDrawerOpen);

  // Function to fetch customer data and their cart data
  const fetchCustomer = async (): Promise<void> => {
    try {
      const customerData = await getAllDocsFromCollection<CustomerType>('customers');
      const formattedCustomerData = customerData.map(async (customerDoc) => {
        // Fetch cart data for each customer
        const cartData = await getAllDocsFromCollection<CartType>(`customers/${customerDoc.id}/cart`);
        return {
          ...customerDoc, // Keep customer data
          cart: cartData, // Add cart data to customer
        };
      });

      // Wait for all customer data with cart data to be fetched
      const customersWithCart = await Promise.all(formattedCustomerData);
      setCustomers(customersWithCart); // Set the fetched customers with cart data into state
      console.log('Fetched customers with cart:', customersWithCart);
    } catch (error) {
      console.error('Error fetching customers with cart:', error);
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
                  aria-label="View Cart"
                  onClick={toggleCartDrawer}
                >
                  <Badge badgeContent={customer.cart.length} color="primary">
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
        markAsRead={() => {}}
        cartDrawerOpen={cartDrawerOpen}
        toggleCartDrawer={toggleCartDrawer}
        cartProducts={customers.flatMap((customer) =>
          customer.cart.map((cartItem) => ({
            id: cartItem.id,
            productName: cartItem.productTitle || 'Unnamed Product',
            price: cartItem.price.toString() || '0', // Convert number to string
          }))
        )}
      />



      {/* Drawer for FavouriteDrawer */}
      <FavouriteDrawer
        markAsRead={() => {}}
        favDrawerOpen={favDrawerOpen}
        toggleFavDrawer={toggleFavDrawer}
        favoriteProducts={favoriteProducts}
      />
    </Box>
  );
}
