'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AppProvider } from '@toolpad/core/AppProvider';
import { Box, Typography, Breadcrumbs, Link } from "@mui/material";
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { NAVIGATION, demoTheme, demoSession } from '../../../utils/drawer';
import AccountSidebarInfo from '../../../components/Drawer/AccountSidebarInfo/index';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/utils/firbeaseConfig'; // Firebase config
import Loader from '@/components/Loader';

// Import your route components
import DashboardContent from './page';
import Analytics from './Analytics/pgae';

// Route-to-component mapping
const ROUTE_COMPONENTS = {
  '/dashboard': DashboardContent,
  '/analytics':Analytics,
};

function DashboardLayoutWithAccountInfo(props) {
  const { window } = props;
  const [pathname, setPathname] = useState('/dashboard');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setLoading(false);
      } else {
        setIsAuthenticated(false);
        setLoading(false);
        router.push('/login');
      }
    });
  }, [router]);

  const routerContext = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    return pathSegments.map((segment, index) => {
      const url = '/' + pathSegments.slice(0, index + 1).join('/');
      return (
        <Link key={index} href={url}>
          <Typography color="primary">{segment}</Typography>
        </Link>
      );
    });
  };

  const renderContent = () => {
    const Component = ROUTE_COMPONENTS[pathname];
    if (Component) {
      return <Component />;
    }
    return <Typography>404 - Page Not Found</Typography>;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={routerContext}
      theme={demoTheme}
      window={window}
      session={demoSession}
      branding={{
        logo: (
          <Image
            className="mt-2"
            src="/apni-mati-vastram-logo.png"
            alt="Apni Mati Vastram Logo"
            width={100}
            height={100}
            priority
          />
        ),
        title: false,
      }}
    >
      <DashboardLayout
        slots={{
          sidebarFooter: () => <AccountSidebarInfo />,
        }}
      >
        {/* Breadcrumbs */}
        <Box sx={{ p: 2 }}>
          <Breadcrumbs aria-label="breadcrumb">{generateBreadcrumbs()}</Breadcrumbs>
        </Box>
        {/* Render Content Based on Route */}
        <Box sx={{ p: 2 }}>
          {renderContent()}
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}

export default DashboardLayoutWithAccountInfo;
