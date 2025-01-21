import DashboardContent from '@/app/dashboard/Main/page';
import AnalyticsDashboard from '@/app/dashboard/analytics/page';
import Categories from '@/app/dashboard/manage-category/categories/page';
import SubCategoires from '@/app/dashboard/manage-category/sub-categories/page';
import AddProduct from '@/app/dashboard/manage-product/add-new-product/page';
import ViewProduct from '@/app/dashboard/manage-product/view-all-product/page';
import EditProduct from '@/app/dashboard/manage-product/edit-product/[productId]/page';
import ProductReview from '@/app/dashboard/product-reviews-and-raiting/page';
import ViewAllOrderPage from '@/app/dashboard/orders/view-all-orders/page';
import OrderDetailsPage from '@/app/dashboard/orders/order-details/page';
import PendingOrdersDetails from '@/app/dashboard/orders/pending-orders/page';
import CompletedOrderPage from '@/app/dashboard/orders/completed-orders/page';
import ReturnOrders from '@/app/dashboard/orders/return-order/page';
import RefundOrderPage from '@/app/dashboard/orders/refund-orders/page';
import ManageAllProduct from '@/app/dashboard/manage-product/page';
import TestimonialsPage from '@/app/dashboard/testimonials/page';
import Tags from '@/app/dashboard/tags/page';
import AddNewCustomer from '@/app/dashboard/customers/add-new-customers/page';
import ThemePage from '@/app/dashboard/theme/page';
import RecentOrders from '@/app/dashboard/orders/return-order/page';
import CustomersTable from '@/components/Customer/CustomerTable/page';
import Coupons from '@/app/dashboard/coupons/page';
import EditViewCoupons from '@/app/dashboard/coupons/[couponCode]/page';
import FAQ from '@/app/dashboard/pages/faq/page';
import ShippingPolicy from '@/app/dashboard/pages/shipping-policy/page';
import TermsCondition from '@/app/dashboard/pages/terms-condition/page';
import PrivacyPolicy from '@/app/dashboard/pages/privacy-policy/page';
import ReturnRefundPolicy from '@/app/dashboard/pages/return-refund-policy/page';
import AboutPage from '@/app/dashboard/pages/about-us/page';
import Setting from '@/app/dashboard/setting/page';
import PaymentSetting from '@/app/dashboard/payment-setting/page';
import PulseZestSupport from '@/app/dashboard/support/page';
import EmailSettings from '@/app/dashboard/setting/email/page';
// Route-to-component mapping
type RouteComponents = {
  path: string;
  component: React.ComponentType<any>;
  isDynamic?: boolean;
};

const ROUTE_COMPONENTS: RouteComponents[] = [
  { path: '/dashboard', component: DashboardContent },
  { path: '/dashboard/analytics', component: AnalyticsDashboard },
  { path: '/dashboard/recent-order', component: RecentOrders },
  { path: '/dashboard/manage-category/categories', component: Categories },
  { path: '/dashboard/manage-category/sub-categories', component: SubCategoires },
  { path: '/dashboard/manage-product', component: ManageAllProduct },
  { path: '/dashboard/manage-product/add-new-product', component: AddProduct },
  { path: '/dashboard/manage-product/view-all-product', component: ViewProduct },
  { path: '/dashboard/manage-product/edit-product/:productId', component: EditProduct, isDynamic: true },
  { path: '/dashboard/orders/view-all-orders', component: ViewAllOrderPage },
  { path: '/dashboard/orders/order-details', component: OrderDetailsPage },
  { path: '/dashboard/orders/pending-orders', component: PendingOrdersDetails },
  { path: '/dashboard/orders/completed-orders', component: CompletedOrderPage },
  { path: '/dashboard/orders/return-order', component: ReturnOrders },
  { path: '/dashboard/orders/refund-orders', component: RefundOrderPage },
  { path: '/dashboard/coupons/:couponId', component: EditViewCoupons, isDynamic: true },
  { path: '/dashboard/tags', component: Tags },
  { path: '/dashboard/customers/add-new-customers', component: AddNewCustomer },
  { path: '/dashboard/customers/view-all-customers', component: CustomersTable },
  { path: '/dashboard/testimonials', component: TestimonialsPage },
  { path: '/dashboard/product-reviews-and-raiting', component: ProductReview },
  { path: '/dashboard/payment-setting', component: PaymentSetting },
  { path: '/dashboard/coupons', component: Coupons },
  { path: '/dashboard/theme', component: ThemePage },
  { path: '/dashboard/pages/faq', component: FAQ },
  { path: '/dashboard/pages/shipping-policy', component: ShippingPolicy },
  { path: '/dashboard/pages/terms-condition', component: TermsCondition },
  { path: '/dashboard/pages/privacy-policy', component: PrivacyPolicy },
  { path: '/dashboard/pages/return-refund-policy', component: ReturnRefundPolicy },
  { path: '/dashboard/pages/about-us', component: AboutPage },
  { path: '/dashboard/support', component: PulseZestSupport },
  { path: '/dashboard/setting', component: Setting },
  { path: '/dashboard/setting/email', component: EmailSettings },

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
