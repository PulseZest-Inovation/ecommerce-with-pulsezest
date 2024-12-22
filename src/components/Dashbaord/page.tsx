'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { AppData } from '@/types/AppData'; // Adjust the path as necessary
import Image from 'next/image';
import { AppProvider } from '@toolpad/core/AppProvider';
import { Box, Typography, Breadcrumbs } from '@mui/material';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { NAVIGATION, demoTheme } from '@/utils/menu';
import ROUTE_COMPONENTS from '@/utils/route';
import AccountSidebarInfo from '@/components/Drawer/AccountSidebarInfo';
import { useRouter } from 'next/navigation';
import { Result } from 'antd';
import { onAuthStateChanged, User } from 'firebase/auth'; // Import User type from Firebase
import { app, auth } from '@/utils/firbeaseConfig';
import Loader from '@/components/Loader';

// Define the type for route keys (inferred from ROUTE_COMPONENTS)
type RouteKey = keyof typeof ROUTE_COMPONENTS;

interface DashboardProps {
  appData: AppData;
}

const Dashboard: React.FC<DashboardProps> = ({ appData }) => {
  const [pathname, setPathname] = useState<RouteKey>('/dashboard'); // Use a valid key as the initial state
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null); // Ensure user is typed correctly
  const router = useRouter();

  // Handle authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);


  useEffect(()=>{
    console.log(appData.app_name, appData.app_logo)
  })

  // Memoize router context
  const routerContext = useMemo(() => ({
    pathname,
    searchParams: new URLSearchParams(),
    // Change navigate to accept only valid route keys (RouteKey)
    navigate: (path: RouteKey) => setPathname(path),
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
    const Component = ROUTE_COMPONENTS[pathname]; // Safe lookup based on RouteKey
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
      navigation={NAVIGATION as any} // You can cast this if necessary
      router={routerContext as any} // You can cast this if necessary
      theme={demoTheme}
      window={window}
      branding={{
        logo: (
          <Image
            src={appData.app_logo} // Use the app's logo
            alt={`${appData.app_name} Logo`} // Dynamically set the alt text
            width={70}
            height={70}
            priority
          />
        ),
        title: appData.app_name, // Use the app's name as the title
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
