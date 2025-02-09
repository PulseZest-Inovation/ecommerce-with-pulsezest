'use client';
import React, { useState, useEffect } from 'react';
import { message, Watermark } from 'antd';
import SecurityCheck from './securityCheck'; // Ensure the path is correct
import { adminLogin } from '@/services/login'; // Import the adminLogin function
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth
import { auth } from '@/config/firbeaseConfig';
import { AppDataType } from '@/types/AppData';
import { useNotification } from '@/components/Provider/NotificationProvider';
import LoginToEcommerce from './login';
import { getAppData } from '@/services/getApp';
import Loader from '@/components/Loader'; // Add loader for consistent feedback

const Login: React.FC = () => {
  const router = useRouter();
  const [isSecurityVerified, setIsSecurityVerified] = useState(false);
  const [loading, setLoading] = useState(true); // Global loading state
  const [email, setEmail] = useState(''); // Email state
  const [password, setPassword] = useState(''); // Password state
  const [appData, setAppData] = useState<AppDataType | null>(null); // App data state
  const { success, error } = useNotification();

  useEffect(() => {
    // Check Firebase authentication on component mount
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const securityKey = localStorage.getItem('securityKey');
        if (securityKey) {
          try {
            // Validate app data if user is authenticated
            const fetchedData = await getAppData<AppDataType>();
            if (fetchedData) {
              setAppData(fetchedData);
              router.push('/dashboard'); // Redirect to dashboard if valid
              return;
            }
          } catch (err) {
            console.error('Error fetching app data:', err);
          }
        }
      }
      setLoading(false); // Stop loading if not authenticated or no valid securityKey
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [router]);

  const handleSecuritySuccess = async () => {
    message.success('Security check passed!');
    setIsSecurityVerified(true);
    await fetchAppData(); // Fetch app data after security check
  };

  const fetchAppData = async () => {
    try {
      const fetchedData = await getAppData<AppDataType>();
      if (fetchedData) {
        setAppData(fetchedData); // Store fetched app data in state
        console.log('Fetched App Data:', fetchedData);
      } else {
        message.error('App data not found.');
      }
    } catch (err) {
      console.error('Error fetching app data:', err);
      message.error('Failed to fetch app data. Please try again later.');
    }
  };

  const handleLogin = async () => {
    if (loading) return; // Prevent multiple submissions

    if (!email || !password) {
      message.error('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const isLoggedIn = await adminLogin(email, password);
      if (isLoggedIn) {
        success('Success', 'Login Successful!');
        router.replace('/dashboard'); // Redirect to dashboard
      } else {
        error('Error', 'Invalid Credentials!');
        message.error('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      error('Error', 'An error occurred during login. Please try again later.');
      message.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  if (loading) {
    return <Loader />; // Show loader while checking authentication
  }

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
              handleLogin={handleLogin}
              loading={loading}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
          )}
        </div>
      </Watermark>
    </div>
  );
};

export default Login;
