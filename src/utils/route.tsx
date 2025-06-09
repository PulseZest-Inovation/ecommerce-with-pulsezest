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
import ColorAttributes from '@/app/dashboard/attributes/color-attribute/page';

import ManageAttribute from '@/app/dashboard/attributes/edit-attribute/[attributeId]/page';
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
import UsersPage from '@/app/dashboard/users/page';

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
  roles?: string[];
};

const ROUTE_COMPONENTS: RouteComponents[] = [
  { path: '/dashboard', component: DashboardContent, roles: ['administrator', 'product-manager', 'analytics', 'order-manager', 'customer-support', 'marketing', 'viewer'] },
  { path: '/dashboard/analytics', component: AnalyticsDashboard , roles: ['administrator', 'product-manager', 'analytics'] },
  { path: '/dashboard/recent-order', component: RecentOrders, roles: ['administrator', 'order-manager'] },

  // Categoires section
  { path: '/dashboard/manage-category/categories', component: Categories, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/manage-category/sub-categories', component: SubCategoires, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/guide', component: GuidePage,  roles: ['administrator', 'product-manager'] },




  // product section
  { path: '/dashboard/manage-product', component: ManageAllProduct, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/manage-product/add-new-product', component: AddProduct, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/manage-product/view-all-product', component: ViewProduct,   roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/manage-product/edit-product/:productId', component: EditProduct, isDynamic: true,     roles: ['administrator', 'product-manager'] },
  
  
  // Orders Section
  { path: '/dashboard/orders', component: OrderPage, roles: ['administrator', 'order-manager'] },
  { path: '/dashboard/orders/order-details/:orderId', component: ViewOrderPage, isDynamic: true, roles: ['administrator', 'order-manager'] },
  { path: '/dashboard/orders/view-all-orders', component: OrderPage, roles: ['administrator', 'order-manager'] },
  { path: '/dashboard/orders/pending-orders', component: PendingOrdersDetails, roles: ['administrator', 'order-manager'] },
  { path: '/dashboard/orders/completed-orders', component: CompletedOrderPage, roles: ['administrator', 'order-manager'] },
  { path: '/dashboard/orders/return-order', component: ReturnOrders, roles: ['administrator', 'order-manager'] },
  { path: '/dashboard/orders/return-order/:orderId', component: ReturnOrderView, isDynamic: true, roles: ['administrator', 'order-manager'] },
  { path: '/dashboard/orders/refund-orders', component: RefundOrderPage,  roles: ['administrator', 'order-manager'] },


  // Coupons section
  { path: '/dashboard/coupons/:couponId', component: EditViewCoupons, isDynamic: true, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/attributes', component: Attributes, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/attributes/color-attribute', component: ColorAttributes, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/attributes/edit-attribute/:attributeId', component: ManageAttribute, isDynamic: true, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/tags', component: Tags,   roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/customers/add-new-customers', component: AddNewCustomer,  roles: ['administrator', 'product-manager', 'customer-support'] },
  { path: '/dashboard/customers/view-all-customers', component: CustomersTable,   roles: ['administrator', 'product-manager', 'customer-support'] },
  { path: '/dashboard/testimonials', component: TestimonialsPage, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/product-reviews-and-raiting', component: ProductReview, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/setting/payment', component: PaymentSetting, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/coupons', component: Coupons, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/theme', component: ThemePage, roles: ['administrator', 'product-manager'] },

  //users
  { path: '/dashboard/users', component:  UsersPage, roles: ['administrator'] },

  //pages
  { path: '/dashboard/pages/faq', component: FAQ, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/pages/shipping-policy', component: ShippingPolicy, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/pages/terms-condition', component: TermsCondition, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/pages/privacy-policy', component: PrivacyPolicy, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/pages/return-refund-policy', component: ReturnRefundPolicy, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/pages/about-us', component: AboutPage, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/pages/contact-us', component: ContactUsPage, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/support', component: PulseZestSupport, roles: ['administrator', 'product-manager', 'customer-support'] },


  { path: '/dashboard/setting', component: Setting, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/setting/email', component: EmailSettings, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/setting/invoice', component: InovicePage, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/setting/meta-marketing', component: MetaMarketing, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/setting/shiprocket', component: ShipRocketPage, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/setting/facebook-pixel', component: FacebookPixel, roles: ['administrator', 'product-manager'] },
  { path: '/dashboard/setting/search-console', component: SearchConsole, roles: ['administrator', 'product-manager'] },



];

// Function to find the matching component for a route
export const getRouteComponent = (
  route: string,
  userRole?: string | null // <-- Accept userRole
): React.ComponentType | null => {
  for (const { path, component, isDynamic, roles } of ROUTE_COMPONENTS) {
    // Check if userRole is allowed for this route
    if (roles && (!userRole || !roles.includes(userRole))) {
      continue;
    }
    if (isDynamic) {
      const regex = new RegExp(path.replace(/:\w+/g, '\\w+'));
      if (regex.test(route)) {
        return component;
      }
    } else if (path === route) {
      return component;
    }
  }
  return null; // No matching component found
};

export default ROUTE_COMPONENTS;
