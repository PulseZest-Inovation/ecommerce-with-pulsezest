'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { AppData } from '@/types/AppData';
import Image from 'next/image';
import { AppProvider } from '@toolpad/core/AppProvider';
import { Box, Typography, Breadcrumbs } from '@mui/material';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { NAVIGATION, demoTheme } from '@/utils/menu';
import { getRouteComponent } from '@/utils/route'; // Import the helper function
import AccountSidebarInfo from '@/components/Drawer/AccountSidebarInfo';
import { usePathname, useRouter } from 'next/navigation';
import { Result } from 'antd';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/utils/firbeaseConfig';
import Loader from '@/components/Loader';

interface DashboardProps {
  appData: AppData;
}

const Dashboard: React.FC<DashboardProps> = ({ appData }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null); // Auth user state
  const pathname = usePathname(); // Get the current route
  const router = useRouter();

  // Handle authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login'); // Redirect to login page if no user
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [router]);

  useEffect(() => {
    console.log(appData.app_name, appData.app_logo); // Log app data for debugging
  }, [appData]);

  // Memoize the router context to prevent unnecessary re-renders
  const routerContext = useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (route: string) => router.push(route), // Simplify navigation logic
    }),
    [pathname, router]
  );

  // Generate breadcrumbs dynamically based on the current route
  const generateBreadcrumbs = useMemo(() => {
    const pathSegments = pathname?.split('/').filter(Boolean) || [];
    return pathSegments.map((segment, index) => (
      <Typography key={index} className="cursor-pointer" color="primary">
        {segment.toUpperCase()}
      </Typography>
    ));
  }, [pathname]);

  // Render content based on the current route
  const renderContent = () => {
    const Component = getRouteComponent(pathname); // Use the helper function
    if (Component) {
      return <Component />; // Render the selected component
    }
    return (
      <Result
        status="404"
        title="Page Not Found"
        subTitle="The page you are looking for does not exist."
      />
    );
  };

  // Loading state and user authentication check
  if (loading) {
    return <Loader />; // Show loader while checking authentication
  }

  if (!user) {
    return null; // Prevent rendering if the user is not authenticated
  }

  return (
    <AppProvider
      navigation={NAVIGATION as any} // You can cast this if necessary
      router={routerContext as any}
      theme={demoTheme}
      window={window}
      branding={{
        logo: (
          <Image
            src={appData.app_logo}
            alt={`${appData.app_name} Logo`}
            width={70}
            height={70}
            priority
          />
        ),
        title: appData.app_name,
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
};

export default Dashboard;
