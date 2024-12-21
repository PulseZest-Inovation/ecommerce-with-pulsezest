import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/utils/firbeaseConfig'; // Your Firebase config

const auth = getAuth(app);

export const checkAuth = (): boolean => {
  let isAuthenticated = false;

  // Using the onAuthStateChanged to check if the user is authenticated
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      isAuthenticated = true;
    } else {
      // No user is signed in
      isAuthenticated = false;
    }
  });

  return isAuthenticated;
};
