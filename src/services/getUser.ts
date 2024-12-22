import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../utils/firbeaseConfig';  

// Function to get user details from Firestore by current authenticated user ID
export const getUser = async () => {
  try {
    // Get the current user from Firebase Authentication
    const currentUser =  auth.currentUser; // Get the current authenticated user
    console.log(currentUser?.uid)
    if (!currentUser) {
      throw new Error('No user is logged in!');
    }

    // Reference to the user document using the current user's ID
    const userDocRef = doc(db, 'app_name', currentUser.uid); // 'users' is the collection name in Firestore
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Returning user data if the document exists
      return userDoc.data();
    } else {
      throw new Error('User not found!');
    }
  } catch (error) {
    console.error('Error fetching user data: ', error);
    throw error;
  }
};
