'use client';

import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashbaord/page'; // Correct the path if necessary
import { getAppData } from './getApp'; // Adjust the path as needed
import { AppDataType } from '@/types/AppData';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';

const DashboardWrapper: React.FC = () => {
  const [appData, setAppData] = useState<AppDataType | null>(null);
  const [loading, setLoading] = useState(true); // Show loading until app data is validated
  const router = useRouter();

  useEffect(() => {
    const fetchAppData = async () => {
      try {
        const securityKey = localStorage.getItem('securityKey');

        // If no security key exists, redirect to login
        if (!securityKey) {
          router.replace('/login');
          return;
        }

        // Fetch app data using the security key
        const data = await getAppData<AppDataType>();

        if (data) {
          setAppData(data); // Successfully retrieved app data
        } else {
          throw new Error('App data not found'); // Redirect if app data isn't found
        }
      } catch (error) {
        console.error('Error fetching app data:', error);
        router.replace('/login'); // Redirect to login on error
      } finally {
        setLoading(false); // Stop loader regardless of success or failure
      }
    };

    fetchAppData();
  }, [router]);

  // Show a loader while validating
  if (loading) {
    return <Loader />;
  }

  // If no app data is fetched, do not render anything (handled by redirection)
  if (!appData) {
    return null;
  }

  // Render the dashboard with fetched data
  return <Dashboard appData={appData} />;
};

export default DashboardWrapper;
