import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/utils/firbeaseConfig';

// Function to get user details from Firestore by current authenticated user ID
export const getUser = async () => {
  try {
    // Check if running in the browser
    if (typeof window === "undefined") {
      throw new Error('This code is running on the server, localStorage is not available!');
    }

    // Get the current user from Firebase Authentication
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No user is logged in!');
    }

    // Retrieve the appKey from localStorage
    const appKey = localStorage.getItem("securityKey");
    if (!appKey) {
      throw new Error('No security key found in localStorage!');
    }

    // Reference to the user document using the current user's ID
    const userDocRef = doc(db, 'app_name', appKey, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Returning user data if the document exists
      return userDoc.data();
    } else {
      throw new Error('User document not found!');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};
