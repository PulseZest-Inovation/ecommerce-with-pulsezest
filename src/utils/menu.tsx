import DashboardIcon from '@mui/icons-material/Dashboard';
import { AddProuducts, ProductIcon, AllProduct, OrderIcon, CustomerIcon,  ReviewAndRatingIcon,PendingOrderIcon, OrderCompeltedIcon, DiscountIcon, ManageCategoriesIcon, TestimonialIcon, ReturnAndExchangeIcon, UserGuide, AttributeIcon  } from '../components/Icons/page'; // Ensure these icons are defined
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import PaletteIcon from '@mui/icons-material/Palette';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import GroupsIcon from '@mui/icons-material/Groups';
import TimerIcon from '@mui/icons-material/Timer';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { extendTheme } from '@mui/material/styles';
import CategoryIcon from '@mui/icons-material/Category';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import Person3Icon from '@mui/icons-material/Person3';
import PermMediaIcon from '@mui/icons-material/PermMedia';

export const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
    roles: ['administrator', 'product-manager', 'analytics', 'order-manager', 'customer-support', 'marketing', 'viewer'],
  },
  {
    segment: 'dashboard/analytics',
    title: 'Analytics',
    icon: <AnalyticsIcon />,
    roles: ['administrator', 'product-manager', 'analytics'],

  },
   //Mange Orders
   {
    segment: 'dashboard/orders',
    title: 'Orders',
    icon: <OrderIcon />,
    roles: ['administrator', 'order-manager'],
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
    roles: ['administrator', 'product-manager'],
  },
   
    //Mange Proudct
        {
          segment: 'dashboard/manage-product',
          title: 'Manage Proudct',
          icon: <ProductIcon />,
          roles: ['administrator', 'product-manager'],
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
            roles: ['administrator', 'product-manager'],
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
            roles: ['administrator', 'product-manager'],
            icon: <UserGuide  />,
          },
  
          {
            segment: 'dashboard/tags',
            title: 'Tags',
            roles: ['administrator', 'product-manager'],
            icon: <LocalOfferIcon  />,
          },
          {
            segment: 'dashboard/attributes',
            title: 'Attirubtes',
            icon: <AttributeIcon  />,
            roles: ['administrator', 'product-manager'],
          },
        

          {
            segment: 'dashboard/product-reviews-and-raiting',
            title: 'Product Review and Raiting',
            icon: <ReviewAndRatingIcon />,
            roles: ['administrator', 'product-manager'],
          },
  {
    kind: 'divider',
    roles: ['administrator', 'product-manager'],
  },
         
  {
    kind: 'header',
    title: 'Manage Customers',
    roles: ['administrator', 'product-manager', 'customer-support'],
  },
  {
    segment: 'dashboard/customers',
    title: 'customers',
    icon: <CustomerIcon />,
    roles: ['administrator', 'product-manager', 'customer-support'],
    children: [
      {
        segment: 'view-all-customers',
        title: 'View All Customers',
        icon: <GroupsIcon />,
        roles: ['administrator', 'product-manager', 'customer-support'],

      },
      {
        segment: 'add-new-customers',
        title: 'Add New Customer',
        icon: <PersonAddAltIcon  />,
        roles: ['administrator', 'product-manager', 'customer-support'],
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
        roles: ['administrator', 'product-manager'],
      },
      {
        kind: 'divider',
        roles: ['administrator', 'product-manager'],

      },
     
       {
         kind: 'header',
         title: 'Sales',
         roles: ['administrator', 'product-manager'],
       },
       {
        segment: 'dashboard/coupons',
        title: 'Discounts & Coupons',
        icon: <DiscountIcon/>,
        roles: ['administrator', 'product-manager'],
      },
       
 {
        segment: 'dashboard/gallery',
        title: 'Gallery',
        icon: <PermMediaIcon />,
        roles: ['administrator', 'product-manager'],
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
    roles: ['administrator', 'product-manager'],  
  },
  // Analytics
  {
    kind: 'header',
    title: 'Content',
    roles: ['administrator', 'product-manager'],  
  },
  {
    segment: 'dashboard/theme',
    title: 'Appearance and Theme',
    icon: <PaletteIcon />,
    roles: ['administrator', 'product-manager'],  
  },
 
  {
    segment: 'dashboard/pages',
    title: 'Pages',
    icon: <DescriptionIcon />,
    roles: ['administrator', 'product-manager'],  

    children: [
      {
        segment: 'faq',
        title: 'FAQs',
        icon: <DescriptionIcon />,
         roles: ['administrator', 'product-manager'],  
        
      },
      {
        segment: 'terms-condition',
        title: 'Terms and Conditions',
        icon: <DescriptionIcon />,
        roles: ['administrator', 'product-manager'],  
        
      },
      {
        segment: 'privacy-policy',
        title: 'Privacy Policy',
        icon: <DescriptionIcon />,
        roles: ['administrator', 'product-manager'],  
        
      },
      {
        segment: 'return-refund-policy',
        title: 'Return And Refund Policy',
        icon: <DescriptionIcon />,
        roles: ['administrator', 'product-manager'],  
        
      },
      {
        segment: 'shipping-policy',
        title: 'Shipping Policy',
        icon: <DescriptionIcon />,
        roles: ['administrator', 'product-manager'],  
        
      },
      {
        segment: 'contact-us',
        title: 'Contact Us',
        icon: <DescriptionIcon />,
        roles: ['administrator', 'product-manager'],  
        
      },

      {
        segment: 'about-us',
        title: 'About Us',
        icon: <DescriptionIcon />,
        roles: ['administrator', 'product-manager'],  
         
      },
    ],
  },
  {
    kind: 'divider',
    roles: ['administrator', 'product-manager'],

  },
  {
    segment: 'dashboard/setting',
    title: 'Setting',
    icon: <SettingsIcon/>,
    roles: ['administrator', 'product-manager'],
  },

  {
    kind: 'header',
    title: 'users',
    roles: ['administrator'],
  },
   {
    segment: 'dashboard/users',
    title: 'Users',
    icon: <Person3Icon/>,
    roles: ['administrator'],  
  },

  {
    kind: 'divider',
    roles: ['administrator', 'product-manager', 'customer-support'],
  },
  // Analytics
  {
    kind: 'header',
    title: 'Support',
    roles: ['administrator', 'product-manager', 'customer-support'],
  },
  {
    segment: 'dashboard/support',
    title: 'Support',
    icon: <SupportAgentIcon />,
    roles: ['administrator', 'product-manager', 'customer-support'], 
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

