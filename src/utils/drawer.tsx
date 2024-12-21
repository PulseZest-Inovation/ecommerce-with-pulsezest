import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { AddProuducts, ProductIcon, AllProduct, OrderIcon, CustomerIcon, ManageCategories } from '../components/Icons/page'; // Ensure these icons are defined
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import GroupsIcon from '@mui/icons-material/Groups';
import TimerIcon from '@mui/icons-material/Timer';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import InventoryIcon from '@mui/icons-material/Inventory';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { extendTheme } from '@mui/material/styles';

export const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'analytics',
    title: 'Analytics',
    icon: <AnalyticsIcon />,
  },
  {
    segment: 'orders',
    title: 'Orders',
    icon: <InventoryIcon />,
  },
  {
    kind: 'divider',
  },

  {
    kind: 'header',
    title: 'Products Setting',
  },
   
    //Mange Proudct
        {
          segment: 'manageProduct',
          title: 'Manage Proudct',
          icon: <ProductIcon />,
          children: [
            {
              segment: 'addNewProudct',
              title: 'Add New Product',
              icon: <AddProuducts />,
            },
            {
              segment: 'viewAllProduct',
              title: 'View All Product',
              icon: <AllProduct />,
            },
          ],
        },


  //Manage Categories
          {
            segment: 'manageCategories',
            title: 'Mangae Categories',
            icon: <ManageCategories />,
            children: [
              {
                segment: 'categories',
                title: 'Categories',
                icon: <GroupsIcon />,
              },
              {
                segment: 'subCategories',
                title: 'Sub Categories',
                icon: <TimerIcon />,
              },
            ],
          },

  //Mange Orders
          {
            segment: 'orders',
            title: 'Orders',
            icon: <OrderIcon />,
            children: [
              {
                segment: 'viewAllOrders',
                title: 'View All Orders',
                icon: <GroupsIcon />,
              },
              {
                segment: 'orderDetails',
                title: 'Order Details',
                icon: <TimerIcon />,
              },
              {
                segment: 'pendingOrders',
                title: 'Pending Orders',
                icon: <TimerIcon />,
              },
              {
                segment: 'completedOrders',
                title: 'Compelted Orders',
                icon: <TimerIcon />,
              },
              {
                segment: 'canceled/Returned Order',
                title: 'Compelted Orders',
                icon: <TimerIcon />,
              },
              {
                segment: 'refundRequests',
                title: 'Refund Requests',
                icon: <TimerIcon />,
              },
            ],
          },

          {
            segment: 'tags',
            title: 'Tags',
            icon: <LayersIcon />,
          },

          {
            segment: 'productReviewsRating',
            title: 'Product Review and Raiting',
            icon: <LayersIcon />,
          },
  {
    kind: 'divider',
  },
         
  {
    kind: 'header',
    title: 'Manage Customers',
  },
  {
    segment: 'customers',
    title: 'customers',
    icon: <CustomerIcon />,
    children: [
      {
        segment: 'Viewallcustomers',
        title: 'View All Customers',
        icon: <GroupsIcon />,
      },
      {
        segment: 'addNewCustomer',
        title: 'Add New Customer',
        icon: <TimerIcon />,
      },
     
    ],
    
  },
   {
        segment: 'customerGroup',
        title: 'Customer Group (eg. vip,Regular)',
        icon: <TimerIcon />,
      },
      {
        segment: 'customerFeedback',
        title: 'Customer Feedback',
        icon: <TimerIcon />,
      },

      {
        kind: 'divider',
      },
     
       {
         kind: 'header',
         title: 'Sales',
       },
       {
        segment: 'discounts & Cupons',
        title: 'Discounts & Coupons',
        icon: <TimerIcon />,
      },
      {
        segment: 'giftCard',
        title: 'Gift Card',
        icon: <TimerIcon />,
      },

 
  {
   kind: 'divider',
 },

  {
    kind: 'header',
    title: 'Setting',
  },
  {
    segment: 'paymentSetting',
    title: 'Payment Setting',
    icon: <AccountBalanceIcon />,
  },
  {
    segment: 'orderSetting',
    title: 'Order Setting',
    icon: <TimerIcon />,
  },
  {
    segment: 'emailNotifications',
    title: 'Email Notification',
    icon: <TimerIcon />,
  },
  {
    kind: 'divider',
  },
  // Analytics
  {
    kind: 'header',
    title: 'Content',
  },
  {
    segment: 'bannerAndSlider',
    title: 'Banner/Sliders',
    icon: <LayersIcon />,
  },
  {
    segment: 'homePageContent',
    title: 'Home Page Content',
    icon: <LayersIcon />,
  },
  {
    segment: 'pages',
    title: 'Pages',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'faq',
        title: 'FAQs',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'termsCondition ',
        title: 'Terms and Conditions',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'privacyPolicy ',
        title: 'Privacy Policy',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'returnAndRefundPolicy ',
        title: 'Return And Refund Policy',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'aboutUs ',
        title: 'About Us',
        icon: <DescriptionIcon />,
      },
    ],
  },
 
 
];

 
// Using createTheme instead of extendTheme
export const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

