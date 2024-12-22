'use client';
import React, { useState, useEffect } from 'react';
import { Input, Button, message, Watermark } from 'antd';
import SecurityCheck from './securityCheck'; // Ensure the path is correct
import { adminLogin } from './adminlogin'; // Import the adminLogin function
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import {  onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth
import { auth } from '@/utils/firbeaseConfig';
import { useNotification } from '@/components/Provider/NotificationProvider'

const Login: React.FC = () => {
  const router = useRouter(); // Get the router instance here
  const [isSecurityVerified, setIsSecurityVerified] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const {success, error} = useNotification();


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
    setIsSecurityVerified(true);
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
        success('Success', 'Login Successful!')
        router.replace('/dashboard'); 
      } else {
        message.error('Invalid credentials! Please try again.');
        error('Error', 'Invalid Credentials!')
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
      <Watermark content={isSecurityVerified ? "Verifed user": "Ecommerce with pulsezest"}   className='z-0'>
        <div className="flex items-center justify-center h-screen bg-blue-100 z-10">
          {!isSecurityVerified ? (
            <SecurityCheck onSuccess={handleSecuritySuccess} />
          ) : (
            <div className="bg-white p-6 shadow-lg rounded-lg w-96 z-10">
              <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
                Administration Login
              </h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                    size="large"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-bold mb-2">Password</label>
                  <Input.Password
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                    size="large"
                  />
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleLogin}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                  loading={loading}
                >
                  Login
                </Button>
              </form>
            </div>
          )}
        </div>
      </Watermark>
    </div>
  );
};

export default Login;
