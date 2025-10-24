'use client';
import React, { useState, useEffect } from 'react';
import { message, Watermark } from 'antd';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getAllDocFromUsersCollection, getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firbeaseConfig';
import { AppDataType } from '@/types/AppData';
import { useNotification } from '@/components/Provider/NotificationProvider';
import LoginToEcommerce from './login';
import { getAppData } from '@/services/getApp';
import Loader from '@/components/Loader';
import { UserType } from '@/types/User';

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

  // const fetchAppData = async () => {
  //   try {
  //     const fetchedData = await getAppData<AppDataType>();
  //     if (fetchedData) {
  //       setAppData(fetchedData);
  //       console.log('Fetched App Data:', fetchedData);
  //     } else {
  //       message.error('App data not found.');
  //     }
  //   } catch (err) {
  //     console.error('Error fetching app data:', err);
  //     message.error('Failed to fetch app data. Please try again later.');
  //   }
  // };

 const handleLogin = async () => {
  if (loading) return;

  if (!email || !password) {
    message.error('Please enter both email and password.');
    return;
  }

  setLoading(true);

  try {
    // 1. Login with Firebase Auth
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const users = await getAllDocFromUsersCollection<UserType>();
    const userData = users.find((u: any) => u.id === user.uid);

    if (userData   && userData.applicationId) {
      localStorage.setItem("userRole", userData.roleType);
      localStorage.setItem("securityKey", userData.applicationId);
    } else {
      message.error("User role not found. Please contact admin.");
      setLoading(false);
      return;
    }

    success('Success', 'Login Successful!');
    // router.replace('/dashboard');
    window.location.reload();
  } catch (err) {
    console.error('Login error:', err);
    error('Error', 'Invalid credentials or error occurred.');
    message.error('Invalid credentials or error occurred.');
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
