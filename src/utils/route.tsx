import DashboardContent from '@/app/dashboard/Main/page';
import AnalyticsContent from '@/app/dashboard/analytics/page';
import Categories from '@/app/dashboard/manage-category/categories/page';
import AddProduct from '@/app/dashboard/manage-product/add-new-product/page';
import ViewProduct from '@/app/dashboard/manage-product/view-all-product/page';
import EditProduct from '@/app/dashboard/manage-product/edit-product/[productId]/page';
import Tags from '@/app/dashboard/tags/page';
import Customers from '@/app/dashboard/customers/page';
import RecentOrder from '@/app/dashboard/recent-order/page';
import CustomersTable from '@/components/Customer/CustomerTable/page';

// Route-to-component mapping
type RouteComponents = {
  path: string;
  component: React.ComponentType;
  isDynamic?: boolean;
};

const ROUTE_COMPONENTS: RouteComponents[] = [
  { path: '/dashboard', component: DashboardContent },
  { path: '/dashboard/analytics', component: AnalyticsContent },
  { path: '/dashboard/recent-order', component: RecentOrder },
  { path: '/dashboard/manage-category/categories', component: Categories },
  { path: '/dashboard/manage-product/add-new-product', component: AddProduct },
  { path: '/dashboard/manage-product/view-all-product', component: ViewProduct },
  { path: '/dashboard/manage-product/edit-product/:productId', component: EditProduct, isDynamic: true },
  { path: '/dashboard/tags', component: Tags },
  { path: '/dashboard/customers/add-new-customers', component: Customers },
  { path: '/dashboard/customers/view-all-customers', component: CustomersTable },
];

// Function to find the matching component for a route
export const getRouteComponent = (route: string): React.ComponentType | null => {
  for (const { path, component, isDynamic } of ROUTE_COMPONENTS) {
    if (isDynamic) {
      // Match dynamic routes
      const regex = new RegExp(path.replace(/:\w+/g, '\\w+'));
      if (regex.test(route)) {
        return component;
      }
    } else if (path === route) {
      // Match static routes
      return component;
    }
  }
  return null; // No matching component found
};

export default ROUTE_COMPONENTS;
