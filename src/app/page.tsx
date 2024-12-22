'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../utils/firbeaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Loader from '@/components/Loader';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Navigate to app if authenticated
        console.log('User is authenticated');
        router.push('/dashboard'); // Navigate to app route
      } else {
        // Navigate to login if not authenticated
        console.log('No user found');
        router.push('/login');
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [router]);

  return <Loader />; // Show loader while checking auth
}
