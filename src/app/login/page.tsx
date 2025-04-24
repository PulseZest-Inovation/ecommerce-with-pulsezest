'use client';
import React, { useState, useEffect } from 'react';
import { message, Watermark } from 'antd';
import { adminLogin } from '@/services/login';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firbeaseConfig';
import { AppDataType } from '@/types/AppData';
import { useNotification } from '@/components/Provider/NotificationProvider';
import LoginToEcommerce from './login';
import { getAppData } from '@/services/getApp';
import Loader from '@/components/Loader';

const Login: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [appData, setAppData] = useState<AppDataType | null>(null);
  const { success, error } = useNotification();

  useEffect(() => {
    // Check Firebase authentication on component mount
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const fetchedData = await getAppData<AppDataType>();
          if (fetchedData) {
            setAppData(fetchedData);
            router.push('/dashboard');
            return;
          }
        } catch (err) {
          console.error('Error fetching app data:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchAppData = async () => {
    try {
      const fetchedData = await getAppData<AppDataType>();
      if (fetchedData) {
        setAppData(fetchedData);
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
    if (loading) return;

    if (!email || !password) {
      message.error('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const isLoggedIn = await adminLogin(email, password);
      if (isLoggedIn) {
        success('Success', 'Login Successful!');
        router.replace('/dashboard');
      } else {
        error('Error', 'Invalid Credentials!');
        message.error('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      error('Error', 'An error occurred during login. Please try again later.');
      message.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Watermark
        content={appData ? appData.app_name : 'Ecommerce with PulseZest'}
        className="z-0"
        image={appData?.app_logo}
      >
        <div className="flex items-center justify-center h-screen bg-blue-100 z-10">
          <LoginToEcommerce
            handleLogin={handleLogin}
            loading={loading}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />
        </div>
      </Watermark>
    </div>
  );
};

export default Login;
