'use client'
import * as React from 'react';
import Image from 'next/image';
import { AppProvider } from '@toolpad/core/AppProvider';
import { Box, Typography } from "@mui/material";
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { NAVIGATION, demoTheme, demoSession } from '../../../utils/drawer';
import AccountSidebarInfo from '../../../components/Drawer/AccountSidebarInfo/index';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useEffect, useState } from 'react';
import {onAuthStateChanged } from 'firebase/auth';
import {auth } from '@/utils/firbeaseConfig'; // Your Firebase config
import Loader from '@/components/Loader';
import { NotificationProvider } from '@/components/Provider/NotificationProvider';


function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

function DashboardLayoutWithAccountInfo(props) {
  const { window } = props;
  const [pathname, setPathname] = React.useState('/dashboard');
  const [loading, setLoading] = useState(true); // Add loading state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication
  const router = useRouter(); // Use Next.js useRouter hook

  useEffect(() => {
    // Listen to authentication state change
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // User is authenticated
        setLoading(false); // Loading done
      } else {
        setIsAuthenticated(false); // User is not authenticated
        setLoading(false); // Loading done
        router.push('/login'); // Redirect to login if not authenticated
      }
    });
  }, [router]); // Trigger this effect on component mount

  const routerContext = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  if (loading) {
    // Show loading state while checking authentication
    return <Loader/>;
  }

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={routerContext}
      theme={demoTheme}
      window={window} // Using window prop directly
      session={demoSession}
      branding={{
        title: 'Your Applicaiton Name',
        // logo: (
        //   <Image
        //     src="/prouto-logo.png"
        //     alt="Prouto Logo"
        //     width={40}
        //     height={40}
        //     priority
        //   />
        // ),
      }}
    >
 
      <DashboardLayout
        slots={{
          sidebarFooter: () => (
            <AccountSidebarInfo /> // User info component
          ),
        }}
      >
        <DemoPageContent pathname={pathname} />
      </DashboardLayout>
    
    </AppProvider>
  );
}

export default DashboardLayoutWithAccountInfo;
