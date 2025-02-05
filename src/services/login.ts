// adminlogin.ts
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/config/firbeaseConfig"; // Your Firebase config

const auth = getAuth(app);

export const adminLogin = async (email: string, password: string): Promise<boolean> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return !!userCredential.user; // If a user is returned, return true
  } catch (error) {
    console.error("Login failed:");
    return false; // Return false if there is an error (e.g., incorrect credentials)
  }
};
