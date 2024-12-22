'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { AppProvider } from '@toolpad/core/AppProvider';
import { Box, Typography, Breadcrumbs } from "@mui/material";
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { NAVIGATION, demoTheme } from '@/utils/menu';
import ROUTE_COMPONENTS from '@/utils/route';
import AccountSidebarInfo from '@/components/Drawer/AccountSidebarInfo';
import { useRouter } from 'next/navigation';
import { Result } from 'antd';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/utils/firbeaseConfig';
import Loader from '@/components/Loader';

function Dashboard({ window }) {
  const [pathname, setPathname] = useState('/dashboard');
  const [loading, setLoading] = useState(true); // Initially loading
  const [user, setUser] = useState(null); // Store authenticated user
  const router = useRouter();

  // Handle authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set authenticated user
      } else {
        router.push('/login'); // Redirect if unauthenticated
      }
      setLoading(false); // Stop loading once check is complete
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  // Memoize router context
  const routerContext = useMemo(() => ({
    pathname,
    searchParams: new URLSearchParams(),
    navigate: (path) => setPathname(path),
  }), [pathname]);

  // Generate breadcrumbs from the current pathname
  const generateBreadcrumbs = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    return pathSegments.map((segment, index) => (
      <Typography key={index} className="cursor-pointer" color="primary">
        {segment.toUpperCase()}
      </Typography>
    ));
  }, [pathname]);

  // Render dynamic content based on the current route
  const renderContent = () => {
    const Component = ROUTE_COMPONENTS[pathname];
    if (Component) {
      return <Component />;
    }
    return (
      <Result
        status="500"
        title="We Are Currently Working on This"
        subTitle="Very Soon It Will Be Active!"
      />
    );
  };

  if (loading) {
    return <Loader />; // Show loader while checking authentication
  }

  if (!user) {
    return null; // Prevent rendering if the user is not authenticated
  }

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={routerContext}
      theme={demoTheme}
      window={window}
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
        {/* Breadcrumbs Section */}
        <Box sx={{ p: 2 }}>
          <Breadcrumbs aria-label="breadcrumb">{generateBreadcrumbs}</Breadcrumbs>
        </Box>

        {/* Render Content Section */}
        <Box sx={{ p: 2 }}>{renderContent()}</Box>
      </DashboardLayout>
    </AppProvider>
  );
}

export default Dashboard;
