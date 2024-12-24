import DashboardContent from '@/app/dashboard/Main/page';
import AnalyticsContent from '@/app/dashboard/analytics/page';
import Categories from '@/app/dashboard/manage-category/categories/page';
import AddProduct from  '@/app/dashboard/manage-product/add-new-product/page';
import ViewProduct from '@/app/dashboard/manage-product/view-all-product/page';
import Tags from '@/app/dashboard/tags/page';
import Customers from '@/app/dashboard/customers/page';
import CustomersTable from '@/components/Customer/CustomerTable/page';
// Route-to-component mapping

const ROUTE_COMPONENTS = {
  '/dashboard': DashboardContent,
  '/dashboard/analytics': AnalyticsContent,
  '/dashboard/manage-category/categories': Categories,
  '/dashboard/manage-product/add-new-product': AddProduct,
  '/dashboard/manage-product/view-all-product': ViewProduct,
  '/dashboard/tags': Tags,
  '/dashboard/customers/add-new-customers': Customers,
  '/dashboard/customers/view-all-customers': CustomersTable
};

export default ROUTE_COMPONENTS;