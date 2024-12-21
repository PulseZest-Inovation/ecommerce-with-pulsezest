import DashboardContent from '@/app/(pages)/dashboard/page';
import AnalyticsContent from '@/app/(pages)/dashboard/Analytics/pgae';

// Route-to-component mapping
const ROUTE_COMPONENTS = {
  '/dashboard': DashboardContent,
  '/analytics': AnalyticsContent,
};

export default ROUTE_COMPONENTS;