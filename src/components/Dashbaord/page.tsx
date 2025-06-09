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
import { auth } from '@/config/firbeaseConfig';
import Loader from '@/components/Loader';
import NotificationBar from '../Drawer/Notification/page';
import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import { AppDataType } from '@/types/AppData';

interface DashboardProps {
  appData: AppDataType;
  userRole: string | null;
}

const filterMenuByRole = (menu: any[], userRole: string | null): any[] => {
  return menu
    .filter(item => !item.roles || (userRole && item.roles.includes(userRole)))
    .map(item =>
      item.children
        ? { ...item, children: filterMenuByRole(item.children, userRole) }
        : item
    );
};

const Dashboard: React.FC<DashboardProps> = ({ appData, userRole }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [isNotificationBarOpen, setIsNotificationBarOpen] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0);

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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifications = await getAllDocsFromCollection('notifications');
        setBadgeCount(notifications.length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Filter menu and routes by userRole
  const filteredMenu = useMemo(
    () => filterMenuByRole(NAVIGATION, userRole),
    [userRole]
  );

  // Optionally, filter your routes as well if you want to restrict route access
  // const filteredRoutes = useMemo(
  //   () => ROUTE_COMPONENTS.filter(route => !route.roles || (userRole && route.roles.includes(userRole))),
  //   [userRole]
  // );

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
  const Component = getRouteComponent(pathname ?? '', userRole);  
  if (Component) {
    return <Component />;
  }
  return (
    <Result
      status="404"
      title="Page Not Found"
      subTitle="The page you are looking for does not exist or you do not have access."
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
      navigation={filteredMenu as any}
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