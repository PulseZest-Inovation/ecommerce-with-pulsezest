import DashboardContent from '@/app/(pages)/Main/page';
import AnalyticsContent from '@/app/(pages)/Analytics/pgae';
import Categories from '@/app/(pages)/Categories/page';
import AddProduct from '@/app/(pages)/Product/AddProduct/page';
import ViewProduct from '@/app/(pages)/Product/ViewProduct/page';
import Tags from '@/app/(pages)/Tags/page';
import Customers from '@/app/(pages)/Customers/page';
import CustomersTable from '@/components/Customer/CustomerTable/page';
// Route-to-component mapping

const ROUTE_COMPONENTS = {
  '/dashboard': DashboardContent,
  '/analytics': AnalyticsContent,
  '/manageCategories/categories': Categories,
  '/manageProduct/addNewProudct': AddProduct,
  '/manageProduct/viewAllProduct': ViewProduct,
  '/tags': Tags,
  '/customers/addNewCustomer': Customers,
  '/customers/Viewallcustomers': CustomersTable
};

export default ROUTE_COMPONENTS;