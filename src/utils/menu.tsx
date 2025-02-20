import DashboardIcon from '@mui/icons-material/Dashboard';
import { AddProuducts, ProductIcon, AllProduct, OrderIcon, CustomerIcon,  ReviewAndRatingIcon,PendingOrderIcon, OrderCompeltedIcon, DiscountIcon, ManageCategoriesIcon, TestimonialIcon, ReturnAndExchangeIcon, UserGuide } from '../components/Icons/page'; // Ensure these icons are defined
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import PaletteIcon from '@mui/icons-material/Palette';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import GroupsIcon from '@mui/icons-material/Groups';
import TimerIcon from '@mui/icons-material/Timer';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import InventoryIcon from '@mui/icons-material/Inventory';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { extendTheme } from '@mui/material/styles';
import CategoryIcon from '@mui/icons-material/Category';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ReturnAndExchange from '@/components/Product/ProductOtherTab/ProductOtherTabComponents/ReturnAndExchange';

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
    segment: 'dashboard/analytics',
    title: 'Analytics',
    icon: <AnalyticsIcon />,
  },
   //Mange Orders
   {
    segment: 'dashboard/orders',
    title: 'Orders',
    icon: <OrderIcon />,
    children: [
      {
        segment: '',
        title: 'View All Orders',
        icon: <AllProduct />,
      },
      {
        segment: 'pending-orders',
        title: 'Pending Orders',
        icon: <PendingOrderIcon />,
      },  
      {
        segment: 'completed-orders',
        title: 'Completed Orders',
        icon: <OrderCompeltedIcon />,
      },
      {
        segment: 'return-order',
        title: 'Return Order',
        icon: <ReturnAndExchangeIcon />,
      },
      {
        segment: 'refund-orders',
        title: 'Refund Requests',
        icon: <TimerIcon />,
      },
    ],
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
          segment: 'dashboard/manage-product',
          title: 'Manage Proudct',
          icon: <ProductIcon />,
          children: [
            {
              segment: 'add-new-product',
              title: 'Add New Product',
              icon: <AddProuducts />,
            },
            {
              segment: 'view-all-product',
              title: 'View All Product',
              icon: <AllProduct />,
            },
          ],
        },


      


  //Manage Categories
          {
            segment: 'dashboard/manage-category',
            title: 'Mangae Categories',
            icon: <CategoryIcon  />,
            children: [
              {
                segment: 'categories',
                title: 'Categories',
                icon: <CategoryIcon />,
              },
              {
                segment: 'sub-categories',
                title: 'Sub Categories',
                icon: <ManageCategoriesIcon />,
              },
            ],
          },

          {
            segment: 'dashboard/guide',
            title: 'Guide',
            icon: <UserGuide  />,
          },
  
          {
            segment: 'dashboard/tags',
            title: 'Tags',
            icon: <LocalOfferIcon  />,
          },
        

          {
            segment: 'dashboard/product-reviews-and-raiting',
            title: 'Product Review and Raiting',
            icon: <ReviewAndRatingIcon />,
          },
  {
    kind: 'divider',
  },
         
  {
    kind: 'header',
    title: 'Manage Customers',
  },
  {
    segment: 'dashboard/customers',
    title: 'customers',
    icon: <CustomerIcon />,
    children: [
      {
        segment: 'view-all-customers',
        title: 'View All Customers',
        icon: <GroupsIcon />,
      },
      {
        segment: 'add-new-customers',
        title: 'Add New Customer',
        icon: <PersonAddAltIcon  />,
      },
     
    ],
    
  },
  //  {
  //       segment: 'customerGroup',
  //       title: 'Customer Group (eg. vip,Regular)',
  //       icon: <GroupsIcon />,
  //     },
      {
        segment: 'dashboard/testimonials',
        title: 'Testimonials',
        icon: <TestimonialIcon />,
      },
      {
        kind: 'divider',
      },
     
       {
         kind: 'header',
         title: 'Sales',
       },
       {
        segment: 'dashboard/coupons',
        title: 'Discounts & Coupons',
        icon: <DiscountIcon/>,
      },
      // {
      //   segment: 'giftCard',
      //   title: 'Gift Card',
      //   icon: <TimerIcon />,
      // },

 
  // {
  //   segment: 'orderSetting',
  //   title: 'Order Setting',
  //   icon: <TimerIcon />,
  // },
  // {
  //   segment: 'emailNotifications',
  //   title: 'Email Notification',
  //   icon: <TimerIcon />,
  // },
  {
    kind: 'divider',
  },
  // Analytics
  {
    kind: 'header',
    title: 'Content',
  },
  {
    segment: 'dashboard/theme',
    title: 'Appearance and Theme',
    icon: <PaletteIcon />,
  },
 
  {
    segment: 'dashboard/pages',
    title: 'Pages',
    icon: <DescriptionIcon />,
    children: [
      {
        segment: 'faq',
        title: 'FAQs',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'terms-condition',
        title: 'Terms and Conditions',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'privacy-policy',
        title: 'Privacy Policy',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'return-refund-policy',
        title: 'Return And Refund Policy',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'shipping-policy',
        title: 'Shipping Policy',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'contact-us',
        title: 'Contact Us',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'about-us',
        title: 'About Us',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    kind: 'divider',
  },
  {
    segment: 'dashboard/setting',
    title: 'Setting',
    icon: <SettingsIcon/>,
  },

  {
    kind: 'divider',
  },
  // Analytics
  {
    kind: 'header',
    title: 'Support',
  },
  {
    segment: 'dashboard/support',
    title: 'Support',
    icon: <SupportAgentIcon />,
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

