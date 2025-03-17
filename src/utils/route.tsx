import DashboardContent from '@/app/dashboard/coupons/Main/page';
import AnalyticsDashboard from '@/app/dashboard/analytics/page';
import Categories from '@/app/dashboard/manage-category/categories/page';
import SubCategoires from '@/app/dashboard/manage-category/sub-categories/page';

// Product section
import AddProduct from '@/app/dashboard/manage-product/add-new-product/page';
import ViewProduct from '@/app/dashboard/manage-product/view-all-product/page';
import EditProduct from '@/app/dashboard/manage-product/edit-product/[productId]/page';
import ManageAllProduct from '@/app/dashboard/manage-product/page';
import ProductReview from '@/app/dashboard/product-reviews-and-raiting/page';


// Orders section
import OrderPage from '@/app/dashboard/orders/page';
import ViewOrderPage from '@/app/dashboard/orders/order-details/[orderId]/page';
import PendingOrdersDetails from '@/app/dashboard/orders/pending-orders/page';
import CompletedOrderPage from '@/app/dashboard/orders/completed-orders/page';
import ReturnOrders from '@/app/dashboard/orders/return-order/page';
import ReturnOrderView from '@/app/dashboard/orders/return-order/[orderId]/page';
import RefundOrderPage from '@/app/dashboard/orders/refund-orders/page';



import TestimonialsPage from '@/app/dashboard/testimonials/page';
import Tags from '@/app/dashboard/tags/page';
import Attributes from '@/app/dashboard/attributes/page';
import ManageAttribute from '@/app/dashboard/attributes/[attributeId]/page';
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
import ContactUsPage from '@/app/dashboard/pages/contact-us/page';

import Setting from '@/app/dashboard/setting/page';
import PaymentSetting from '@/app/dashboard/setting/payment/page';
import PulseZestSupport from '@/app/dashboard/support/page';
import EmailSettings from '@/app/dashboard/setting/email/page';
import ShipRocketPage from '@/app/dashboard/setting/shiprocket/page';
import FacebookPixel from '@/app/dashboard/setting/facebook-pixel/page';
import SearchConsole from '@/app/dashboard/setting/search-console/page';
import InovicePage from '@/app/dashboard/setting/invoice/page';
import MetaMarketing from '@/app/dashboard/setting/meta-marketing/page';
import GuidePage from '@/app/dashboard/guide/page';

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

  // Categoires section
  { path: '/dashboard/manage-category/categories', component: Categories },
  { path: '/dashboard/manage-category/sub-categories', component: SubCategoires },
  { path: '/dashboard/guide', component: GuidePage },




  // product section
  { path: '/dashboard/manage-product', component: ManageAllProduct },
  { path: '/dashboard/manage-product/add-new-product', component: AddProduct },
  { path: '/dashboard/manage-product/view-all-product', component: ViewProduct },
  { path: '/dashboard/manage-product/edit-product/:productId', component: EditProduct, isDynamic: true },
  
  
  // Orders Section
  { path: '/dashboard/orders', component: OrderPage },
  { path: '/dashboard/orders/order-details/:orderId', component: ViewOrderPage, isDynamic: true },
  { path: '/dashboard/orders/view-all-orders', component: OrderPage },
  { path: '/dashboard/orders/pending-orders', component: PendingOrdersDetails },
  { path: '/dashboard/orders/completed-orders', component: CompletedOrderPage },
  { path: '/dashboard/orders/return-order', component: ReturnOrders },
  { path: '/dashboard/orders/return-order/:orderId', component: ReturnOrderView, isDynamic: true },
  { path: '/dashboard/orders/refund-orders', component: RefundOrderPage },


  // Coupons section
  { path: '/dashboard/coupons/:couponId', component: EditViewCoupons, isDynamic: true },
  { path: '/dashboard/attributes', component: Attributes },
  { path: '/dashboard/attributes/:attributeId', component: ManageAttribute, isDynamic: true },
  { path: '/dashboard/tags', component: Tags },
  { path: '/dashboard/customers/add-new-customers', component: AddNewCustomer },
  { path: '/dashboard/customers/view-all-customers', component: CustomersTable },
  { path: '/dashboard/testimonials', component: TestimonialsPage },
  { path: '/dashboard/product-reviews-and-raiting', component: ProductReview },
  { path: '/dashboard/setting/payment', component: PaymentSetting },
  { path: '/dashboard/coupons', component: Coupons },
  { path: '/dashboard/theme', component: ThemePage },

  //pages
  { path: '/dashboard/pages/faq', component: FAQ },
  { path: '/dashboard/pages/shipping-policy', component: ShippingPolicy },
  { path: '/dashboard/pages/terms-condition', component: TermsCondition },
  { path: '/dashboard/pages/privacy-policy', component: PrivacyPolicy },
  { path: '/dashboard/pages/return-refund-policy', component: ReturnRefundPolicy },
  { path: '/dashboard/pages/about-us', component: AboutPage },
  { path: '/dashboard/pages/contact-us', component: ContactUsPage },
  { path: '/dashboard/support', component: PulseZestSupport },


  { path: '/dashboard/setting', component: Setting },
  { path: '/dashboard/setting/email', component: EmailSettings },
  { path: '/dashboard/setting/invoice', component: InovicePage },
  { path: '/dashboard/setting/meta-marketing', component: MetaMarketing },
  { path: '/dashboard/setting/shiprocket', component: ShipRocketPage },
  { path: '/dashboard/setting/facebook-pixel', component: FacebookPixel },
  { path: '/dashboard/setting/search-console', component: SearchConsole },



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
