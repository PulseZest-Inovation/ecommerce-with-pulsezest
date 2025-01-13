'use client';

import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashbaord/page'; // Corrected the typo in the import
import { getAppData } from './getApp'; // Adjust the path as necessary
import { AppDataType } from '@/types/AppData';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';

const DashboardWrapper = () => {
  const [appData, setAppData] = useState<AppDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAppData = async () => {
      const securityKey = localStorage.getItem('securityKey');
      
      if (!securityKey) {
        setLoading(false); // Set loading to false if no security key is found
        return;
      }

      try {
        const data = await getAppData<AppDataType>('app_name', securityKey); // Fetch data
        setAppData(data);
      } catch (error) {
        console.error('Error fetching app data:', error);
        setAppData(null); // Handle error gracefully
      }
      
      setLoading(false);
    };

    fetchAppData();
  }, []);

  if (loading) {
    return <Loader />; // Show loader while fetching app data
  }

  if (!appData) {
    router.push('/login')
    return  null; // Handle the case where data is null or error
  }

  return <Dashboard appData={appData} />; // Pass the fetched appData to the Dashboard component
};

export default DashboardWrapper;
