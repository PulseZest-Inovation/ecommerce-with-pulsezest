'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {auth} from '../utils/firbeaseConfig'
import { onAuthStateChanged } from 'firebase/auth';
import Loader from '@/components/Loader';

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is authenticated, navigate to dashboard
        console.log('user is there')
        router.push('/dashboard');
      } else {
        // If user is not authenticated, navigate to login page
        console.log('no user found')
        router.push('/login');
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [router]);

  return  <Loader/>; // Show loading text while checking auth
}
