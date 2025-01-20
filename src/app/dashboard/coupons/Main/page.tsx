'use client';

import React from 'react';
import { Typography, Grid } from '@mui/material';
import SummaryCard from '@/components/Dashbaord/Card/SummaryCard';
import ConfirmedOrderCard from '@/components/Dashbaord/Card/ConfirmedOrderCard';
import DashboardGraphs from '@/components/Dashbaord/Graph/DashboardGraph';
import CartView from '@/components/Dashbaord/CartView/page';

const DashboardPage = () => {
  // Data for today's order summary
  const todayOrderSummary = [
    { title: 'Order Placed', value: '0', subtitle: 'Updated 11:24 PM, Today' },
    { title: 'Order Confirmed', value: '0', subtitle: 'Updated 11:24 PM, Today' },
    { title: 'FB Marketing Spend', value: '₹0.00', subtitle: 'Updated 11:24 PM, Today' },
    { title: 'Projected Revenue', value: '0', subtitle: 'Updated 11:24 PM, Today' },
    { title: 'Cost per Order', value: '₹0.00', subtitle: 'Updated 11:24 PM, Today' },
  ];

  // Data for repeat orders
  const repeatOrders = [
    { title: 'Avg. Order/Customer (Orders Delivered)', value: 'Null' },
    { title: 'Avg. Order/Customer (Orders Placed)', value: 'Null' },
  ];

  // Data for customer ratings
  const customerRatings = [
    { title: 'Last 15 Days', value: '0 ⭐' },
    { title: 'Lifetime Ratings', value: '0 ⭐' },
  ];

  // Data for confirmed order summary
  const confirmedOrderSummary = [
    'All Confirmed Orders',
    'Orders in Print/Pack',
    'Orders in Handover',
    'Orders in Transit',
    'Orders Delivered',
    'RTO',
    'Return',
    'Lost',
  ];

  return (
    <div>
      <Grid container spacing={3}>
        {/* Left side: Today's Order Summary and Repeat Orders */}
        <Grid item xs={12} md={8}>
          {/* Section: Today's Order Summary */}
          <Typography variant="h6" className="mb-4 font-bold">
            Today's Order Summary
          </Typography>
          <Grid container spacing={3} className="mb-8">
          {todayOrderSummary.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <SummaryCard title={item.title} value={item.value} subtitle={item.subtitle} />
            </Grid>
          ))}
        </Grid>

          {/* Section: Repeat Orders */}
          <Typography variant="h6" className="mb-4 font-bold">
            Repeat Orders
          </Typography>
          <Grid container spacing={2} className="mb-8">
            {repeatOrders.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <SummaryCard title={item.title} value={item.value} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right side: CartView */}
        <Grid item xs={12} md={4}>
          <CartView />
        </Grid>
      </Grid>

      {/* Section: Customer Rating */}
      <Typography variant="h6" className="font-semibold mb-4">
        Customer Rating
      </Typography>
      <Grid container spacing={2} className="mb-8">
        {customerRatings.map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <SummaryCard title={item.title} value={item.value} />
          </Grid>
        ))}
      </Grid>

      {/* Section: Confirmed Order Summary */}
      <Typography variant="h6" className="font-semibold mb-4">
        Confirmed Order Summary
      </Typography>
      <Grid container spacing={2}>
        {confirmedOrderSummary.map((title, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <ConfirmedOrderCard title={title} value="0" />
          </Grid>
        ))}
      </Grid>

      {/* Show the Graphs */}
      <DashboardGraphs />
    </div>
  );
};

export default DashboardPage;
