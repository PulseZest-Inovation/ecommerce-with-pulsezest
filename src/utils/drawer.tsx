import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { AutoIcon, CarIcon, AddsIcon } from '../components/Icons/page'; // Ensure these icons are defined
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import GroupsIcon from '@mui/icons-material/Groups';
import TimerIcon from '@mui/icons-material/Timer';
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
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'User',
  },
  // Auto user below
   // Car user below
   {
    segment: 'autoUser',
    title: 'Auto User',
    icon: <AutoIcon />,
    children: [
      {
        segment: 'allAutoUser',
        title: 'All Auto User',
        icon: <GroupsIcon />,
      },
      {
        segment: 'pending',
        title: 'Pending Auto User',
        icon: <TimerIcon />,
      },
    ],
  },
  {
    segment: 'carUser',
    title: 'Car User',
    icon: <CarIcon />,
    children: [
      {
        segment: 'allCarUser',
        title: 'All Car User',
        icon: <GroupsIcon />,
      },
      {
        segment: 'pending',
        title: 'Pending Car User',
        icon: <TimerIcon />,
      },
    ],
  },
 
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Advertiser',
  },
  {
    segment: 'allAdvertiser',
    title: 'All Advertiser',
    icon: <AddsIcon />,
  },
  {
    segment: 'pendingAdvertiser',
    title: 'Pending Advertiser',
    icon: <TimerIcon />,
  },
  {
    kind: 'divider',
  },
  // Analytics
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'sales',
        title: 'Sales',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'integrations',
    title: 'Integrations',
    icon: <LayersIcon />,
  },
];

export const demoSession = {
  user: {
    name: 'Bharat Kashyap',
    email: 'bharatkashyap@outlook.com',
    image: 'https://avatars.githubusercontent.com/u/19550456',
  },
};

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

