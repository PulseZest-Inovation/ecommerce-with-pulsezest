'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../config/firbeaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Loader from '@/components/Loader';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {

      if (user) {
        // Navigate to dashboard if authenticated and securityKey exists
        console.log('User is authenticated and securityKey exists');
        router.push('/dashboard');
      } else {
        // Navigate to login if either condition fails
        console.log('Authentication failed or securityKey missing');
        router.push('/login');
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [router]);

  return <Loader />; // Show loader while checking auth
}
