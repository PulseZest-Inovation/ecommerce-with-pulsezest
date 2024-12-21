// UserProfile.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { message, Spin } from 'antd'; // Ant Design for messages and loading spinner
import { getUser } from '@/services/getUser';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null); // State to store user data
  const [loading, setLoading] = useState<boolean>(true); // Loading state for the spinner

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
        const userData = await getUser(); // Call the getUser function to fetch data
        setUser(userData); // Store the user data in state
      } catch (error) {
        message.error('Failed to fetch user data!'); // Show an error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchUserData(); // Trigger the function to fetch data
  }, []); // Empty dependency array to only run once on component mount

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" /> {/* Show a loading spinner while fetching data */}
      </div>
    );
  }

  if (!user) {
    return <div>No user data available!</div>; // Handle case where user data doesn't exist
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">User Profile</h2>
      <div className="space-y-4">
        <div>
          <strong>Name:</strong> {user.name || 'N/A'}
        </div>
        <div>
          <strong>Email:</strong> {user.email || 'N/A'}
        </div>
        <div>
          <strong>Phone Number:</strong> {user.phone || 'N/A'}
        </div>
        {/* Add more fields if needed */}
      </div>
    </div>
  );
};

export default UserProfile;
