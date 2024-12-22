'use client';
import React, { useState, useEffect } from 'react';
import { Input, Button, message, Watermark } from 'antd';
import SecurityCheck from './securityCheck'; // Ensure the path is correct
import { adminLogin } from '@/services/login'; // Import the adminLogin function
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth
import { auth, storage } from '@/utils/firbeaseConfig';
import { app } from '@/types/AppData';
import { useNotification } from '@/components/Provider/NotificationProvider';
import LoginToEcommerce from './login';
import { getDocByDocName } from '@/services/FirestoreData/getFirestoreData';

const Login: React.FC = () => {
  const router = useRouter(); // Get the router instance
  const [isSecurityVerified, setIsSecurityVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(''); // Added email state
  const [password, setPassword] = useState<string>(''); // Added password state
  const [appData, setAppData] = useState<app | null>(null); // State to store the app data
  const { success, error } = useNotification();

  useEffect(() => {
    // Check if the user is already authenticated when the component mounts
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is authenticated, redirect to dashboard
        router.push('/dashboard');
      }
    });

    // Cleanup the subscription when the component is unmounted
    return () => unsubscribe();
  }, [auth, router]);

  const handleSecuritySuccess = () => {
    message.success('Security check passed!');
    fetchAppData(); // Fetch app data when security check passes
    setIsSecurityVerified(true);
  };

  const fetchAppData = async () => {
    try {
      // Fetch data from Firestore using the 'getDocByDocName' function
      const fetchedData = await getDocByDocName<app>("app_name", localStorage.getItem('securityKey') || '');

      if (fetchedData) {
        setAppData(fetchedData); // Set the fetched data in state
        console.log("Fetched App Data:", fetchedData);
      } else {
        message.error('App data not found.');
      }
    } catch (error) {
      console.error('Error fetching app data:', error);
      message.error('Failed to fetch app data. Please try again later.');
    }
  };

  const handleLogin = async () => {
    if (loading) return; // Prevent multiple submissions

    // Simple form validation
    if (!email || !password) {
      message.error('Please enter both email and password.');
      return;
    }

    setLoading(true); // Set loading state

    try {
      // Call adminLogin function
      const isLoggedIn = await adminLogin(email, password);

      if (isLoggedIn) {
        message.success('Login successful!');
        success('Success', 'Login Successful!');
        router.replace('/dashboard');
      } else {
        message.error('Invalid credentials! Please try again.');
        error('Error', 'Invalid Credentials!');
      }
    } catch (error) {
      // Catch and display error during login process
      message.error('An error occurred. Please try again later.');
      console.error('Login error:', error);
    }

    setLoading(false); // Reset loading state
  };

  return (
    <div>
      <Watermark
        content={isSecurityVerified && appData ? appData.app_name : 'Ecommerce with PulseZest'}
        className="z-0"
        image={appData?.app_logo}
      >
        <div className="flex items-center justify-center h-screen bg-blue-100 z-10">
          {!isSecurityVerified ? (
            <SecurityCheck onSuccess={handleSecuritySuccess} />
          ) : (
            <LoginToEcommerce
              handleLogin={handleLogin} // Pass the handleLogin function
              loading={loading} // Pass the loading state
              email={email} // Pass email state
              setEmail={setEmail} // Pass email setter
              password={password} // Pass password state
              setPassword={setPassword} // Pass password setter
            />
          )}
        </div>
      </Watermark>
    </div>
  );
};

export default Login;
