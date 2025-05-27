// adminlogin.ts
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/config/firbeaseConfig"; // Your Firebase config

const auth = getAuth(app);

/**
 * Logs in an admin user using Firebase authentication.
 * @param email - The admin's email address.
 * @param password - The admin's password.
 * @returns A boolean indicating whether the login was successful.
 */
export const adminLogin = async (email: string, password: string): Promise<boolean> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const securityKey = userCredential.user.uid;

    // Store the security key securely (consider alternatives to localStorage)
    localStorage.setItem('securityKey', securityKey);

    return !!userCredential.user; // Return true if a user is returned
  } catch (error) {
    console.error("Login failed:", error); // Log the error details for debugging
    return false; // Return false if there is an error
  }
};
