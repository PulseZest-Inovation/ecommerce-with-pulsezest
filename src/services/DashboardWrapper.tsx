'use client';

import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashbaord/page'; // Corrected the typo in the import
import { getDocByDocName } from '@/services/getFirestoreData'; // Adjust the path as necessary
import { AppData } from '@/types/AppData';
import Loader from '@/components/Loader';

const DashboardWrapper = () => {
  const [appData, setAppData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppData = async () => {
      const securityKey = localStorage.getItem('securityKey');
      
      if (!securityKey) {
        setLoading(false); // Set loading to false if no security key is found
        return;
      }

      try {
        const data = await getDocByDocName<AppData>('app_name', securityKey); // Fetch data
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
    return <div>Error: App data not found!</div>; // Handle the case where data is null or error
  }

  return <Dashboard appData={appData} />; // Pass the fetched appData to the Dashboard component
};

export default DashboardWrapper;
