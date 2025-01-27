'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NotificationsIcon from '@mui/icons-material/Notifications';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import { AppProvider } from '@toolpad/core/AppProvider';
import { Box, Typography, Breadcrumbs } from '@mui/material';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { NAVIGATION, demoTheme } from '@/utils/menu';
import { getRouteComponent } from '@/utils/route';
import AccountSidebarInfo from '@/components/Drawer/AccountSidebarInfo';
import { usePathname, useRouter } from 'next/navigation';
import { Result } from 'antd';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/utils/firbeaseConfig';
import Loader from '@/components/Loader';
import NotificationBar from '../Drawer/Notification/page';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import { AppDataType } from '@/types/AppData';

interface DashboardProps {
  appData: AppDataType;
}

const Dashboard: React.FC<DashboardProps> = ({ appData }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [isNotificationBarOpen, setIsNotificationBarOpen] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0); // State to hold the badge count

  const handleToggleNotificationBar = () => {
    setIsNotificationBarOpen((prev) => !prev);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch badge count from Firestore
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifications = await getAllDocsFromCollection('notifications'); // Replace 'notifications' with your collection name
        setBadgeCount(notifications.length); // Set the count of documents
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const routerContext = useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (route: string) => router.push(route),
    }),
    [pathname, router]
  );

  const generateBreadcrumbs = useMemo(() => {
    const pathSegments = (pathname || '').split('/').filter(Boolean);
    return pathSegments.map((segment, index) => {
      const breadcrumbPath = `/${pathSegments.slice(0, index + 1).join('/')}`;
      return (
        <Link href={breadcrumbPath} key={index} className="hover:underline">
          <Typography className="cursor-pointer" color="primary">
            {segment.toUpperCase()}
          </Typography>
        </Link>
      );
    });
  }, [pathname]);

  const renderContent = () => {
    const Component = getRouteComponent(pathname ?? '');
    if (Component) {
      return <Component />;
    }
    return (
      <Result
        status="404"
        title="Page Not Found"
        subTitle="The page you are looking for does not exist."
      />
    );
  };

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  return (
    <AppProvider
      navigation={NAVIGATION as any}
      router={routerContext as any}
      theme={demoTheme}
      window={window}
      branding={{
        logo: (
          <Image
            src={appData.app_logo}
            alt={`${appData.app_name}-Logo`}
            width={50}
            height={400}
            priority
          />
        ),
        title: appData.app_name,
      }}
    >
      <DashboardLayout
        slots={{
          sidebarFooter: () => <AccountSidebarInfo />,
          toolbarAccount: () => (
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton color="inherit" onClick={handleToggleNotificationBar}>
                <Badge badgeContent={badgeCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Box>
          ),
        }}
      >
        <Box sx={{ p: 2 }}>
          <Breadcrumbs aria-label="breadcrumb">{generateBreadcrumbs}</Breadcrumbs>
        </Box>

        {isNotificationBarOpen && (
          <NotificationBar onClose={() => setIsNotificationBarOpen(false)} />
        )}
        <Box sx={{ p: 2 }}>{renderContent()}</Box>
      </DashboardLayout>
    </AppProvider>
  );
};

export default Dashboard;
