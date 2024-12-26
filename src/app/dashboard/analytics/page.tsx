"use client";
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { LineChart, BarChart } from "@mui/x-charts";

const AnalyticsDashboard = () => {
  // Sample Data (to be replaced with actual data from API or database)
  const totalSales = 12000;
  const ordersCount = 320;
  const topProducts = [
    { name: "Product A", sales: 1500 },
    { name: "Product B", sales: 1000 },
    { name: "Product C", sales: 800 },
  ];

  // Line chart data (traffic trend over a week)
  const trafficData = {
    series: [
      {
        name: "Website Traffic",
        data: [500, 800, 1200, 900, 1500, 2000, 2500],
      },
    ],
    xAxis: [
      {
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
    ],
  };

  // Bar chart data (Sales by Product)
  const salesByProductData = {
    series: [
      {
        name: "Sales (₹)",
        data: topProducts.map((product) => product.sales),
      },
    ],
    xAxis: [
      {
        data: topProducts.map((product) => product.name),
        scaleType: "band", // Ensure scaleType is set for BarChart
      },
    ],
  };

  return (
    <Box sx={{ maxWidth: "1200px", margin: "auto", padding: "24px" }}>
      <Typography variant="h4" gutterBottom>Ecommerce Analytics</Typography>

      {/* Sales Overview */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Sales</Typography>
              <Typography variant="h5">₹{totalSales}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Orders Count</Typography>
              <Typography variant="h5">{ordersCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Order Value</Typography>
              <Typography variant="h5">
              ₹{((totalSales / ordersCount) || 0).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Traffic Overview (Line Chart) */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom>Website Traffic Overview</Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <LineChart
            series={trafficData.series}
            xAxis={trafficData.xAxis}
            height={300}
          />
        </Paper>
      </Box>

      {/* Sales by Product (Bar Chart) */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom>Sales by Product</Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <BarChart
            series={salesByProductData.series}
            height={300}
          />
        </Paper>
      </Box>

      {/* Top Products */}
      <Grid container spacing={3} sx={{ mt: 6 }}>
        {topProducts.map((product) => (
          <Grid item xs={12} sm={4} key={product.name}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="h5">₹{product.sales}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Additional sections can be added here */}
    </Box>
  );
};

export default AnalyticsDashboard;
